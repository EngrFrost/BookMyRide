import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, type Vehicle } from '@prisma/client'
import { join } from 'path'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateVehicleDto } from './dto/create-vehicle.dto'
import type { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto'
import type { UpdateVehicleDto } from './dto/update-vehicle.dto'

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListVehiclesQueryDto): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {}
    if (query.category) where.category = query.category
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    return this.prisma.vehicle.findMany({ where, orderBy: { name: 'asc' } })
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) throw new NotFoundException('Vehicle not found.')
    return vehicle
  }

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.create({ data: dto })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A vehicle with this name already exists.')
      }
      throw error
    }
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    await this.findOne(id)
    try {
      return await this.prisma.vehicle.update({ where: { id }, data: dto })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A vehicle with this name already exists.')
      }
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.prisma.vehicle.delete({ where: { id } })
  }

  async setPhoto(id: string, filename: string): Promise<Vehicle> {
    const imageUrl = `/api/uploads/vehicles/${filename}`
    return this.update(id, { imageUrl })
  }

  static uploadsDir(): string {
    return join(process.cwd(), 'uploads', 'vehicles')
  }
}
