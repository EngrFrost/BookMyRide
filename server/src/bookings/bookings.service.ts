import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  BookingStatus,
  CancelledBy,
  Role,
  type Booking,
  type User,
} from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import {
  bookingValidationMessage,
  computeBookingDate,
  computeBookingEnd,
  overlaps,
  validateCreateBooking,
  validateCustomerCancellation,
} from './booking-rules'
import type { CreateBookingDto } from './dto/create-booking.dto'
import type { ListBookingsQueryDto } from './dto/list-bookings-query.dto'

type BookingWithRelations = Booking & {
  vehicle?: { id: string; name: string; category: string; imageUrl: string | null; status: string }
  user?: { id: string; displayName: string; email: string }
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto, user: User): Promise<BookingWithRelations> {
    const startTime = new Date(dto.startTime)
    const settings = await this.getSettingsRow()

    return this.prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: dto.vehicleId } })
      if (!vehicle) throw new NotFoundException('Vehicle not found.')

      const now = new Date()
      const activeCount = await tx.booking.count({
        where: {
          userId: user.id,
          status: BookingStatus.CONFIRMED,
          endTime: { gt: now },
        },
      })

      const existing = await tx.booking.findMany({
        where: {
          vehicleId: dto.vehicleId,
          status: BookingStatus.CONFIRMED,
        },
        select: { startTime: true, endTime: true },
      })

      const error = validateCreateBooking({
        startTime,
        now,
        settings,
        vehicleStatus: vehicle.status,
        activeBookingCount: activeCount,
        existingWindows: existing,
      })
      if (error) {
        throw new BadRequestException(bookingValidationMessage(error, settings))
      }

      const endTime = computeBookingEnd(startTime)
      const bookingDate = computeBookingDate(startTime)

      try {
        return await tx.booking.create({
          data: {
            userId: user.id,
            vehicleId: dto.vehicleId,
            bookingDate,
            startTime,
            endTime,
            status: BookingStatus.CONFIRMED,
          },
          include: { vehicle: true, user: true },
        })
      } catch {
        throw new BadRequestException(
          'This vehicle is already booked for an overlapping time window.',
        )
      }
    })
  }

  async listMine(userId: string): Promise<BookingWithRelations[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true, user: true },
      orderBy: { startTime: 'desc' },
    })
  }

  async listAll(query: ListBookingsQueryDto): Promise<BookingWithRelations[]> {
    const where: {
      status?: BookingStatus
      vehicleId?: string
      startTime?: { gte: Date; lt: Date }
    } = {}
    if (query.status) where.status = query.status
    if (query.vehicleId) where.vehicleId = query.vehicleId
    if (query.date) {
      const day = new Date(query.date)
      const next = new Date(day)
      next.setDate(next.getDate() + 1)
      where.startTime = { gte: day, lt: next }
    }

    return this.prisma.booking.findMany({
      where,
      include: { vehicle: true, user: true },
      orderBy: { startTime: 'desc' },
    })
  }

  async cancel(id: string, user: User, reason?: string): Promise<BookingWithRelations> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true, user: true },
    })
    if (!booking) throw new NotFoundException('Booking not found.')
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be cancelled.')
    }

    const settings = await this.getSettingsRow()
    const isAdmin = user.role === Role.ADMIN

    if (!isAdmin) {
      if (booking.userId !== user.id) {
        throw new ForbiddenException('You can only cancel your own bookings.')
      }
      if (
        !validateCustomerCancellation({
          startTime: booking.startTime,
          cancellationWindowHours: settings.cancellationWindowHours,
        })
      ) {
        throw new BadRequestException(
          `Bookings can only be cancelled up to ${settings.cancellationWindowHours} hours before the start time.`,
        )
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledBy: isAdmin ? CancelledBy.ADMIN : CancelledBy.CUSTOMER,
        cancellationReason: reason ?? null,
      },
      include: { vehicle: true, user: true },
    })
  }

  async markNoShow(id: string): Promise<BookingWithRelations> {
    const booking = await this.prisma.booking.findUnique({ where: { id } })
    if (!booking) throw new NotFoundException('Booking not found.')

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.NO_SHOW },
      include: { vehicle: true, user: true },
    })
  }

  async getAvailability(vehicleId: string, from: string, to: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } })
    if (!vehicle) throw new NotFoundException('Vehicle not found.')

    const fromMs = new Date(from).getTime()
    const toMs = new Date(to).getTime()

    const bookings = await this.prisma.booking.findMany({
      where: {
        vehicleId,
        status: BookingStatus.CONFIRMED,
      },
      select: { startTime: true, endTime: true },
    })

    return bookings
      .filter((b) =>
        overlaps(fromMs, toMs, b.startTime.getTime(), b.endTime.getTime()),
      )
      .map((b) => ({
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
      }))
  }

  async markCompletedPastBookings(): Promise<number> {
    const result = await this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.CONFIRMED,
        endTime: { lt: new Date() },
      },
      data: { status: BookingStatus.COMPLETED },
    })
    return result.count
  }

  private getSettingsRow() {
    return this.prisma.appSettings.findUniqueOrThrow({ where: { id: 'default' } })
  }
}
