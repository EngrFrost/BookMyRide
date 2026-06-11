import { Injectable } from '@nestjs/common'
import { BookingStatus, VehicleStatus } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

export interface AdminStats {
  todaysBookings: number
  upcomingBookings: number
  activeVehicles: number
  totalUsers: number
  bookingsPerDay: { date: string; count: number }[]
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<AdminStats> {
    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const [todaysBookings, upcomingBookings, activeVehicles, totalUsers] =
      await Promise.all([
        this.prisma.booking.count({
          where: {
            startTime: { gte: todayStart, lt: tomorrowStart },
          },
        }),
        this.prisma.booking.count({
          where: {
            status: BookingStatus.CONFIRMED,
            startTime: { gt: now },
          },
        }),
        this.prisma.vehicle.count({
          where: { status: VehicleStatus.AVAILABLE },
        }),
        this.prisma.user.count(),
      ])

    const bookingsPerDay: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now)
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const count = await this.prisma.booking.count({
        where: {
          startTime: { gte: dayStart, lt: dayEnd },
        },
      })

      bookingsPerDay.push({
        date: dayStart.toISOString().slice(0, 10),
        count,
      })
    }

    return {
      todaysBookings,
      upcomingBookings,
      activeVehicles,
      totalUsers,
      bookingsPerDay,
    }
  }
}
