import { BookingStatus } from '@prisma/client'
import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator'

export class ListBookingsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus

  @IsOptional()
  @IsUUID()
  vehicleId?: string

  @IsOptional()
  @IsISO8601()
  date?: string
}
