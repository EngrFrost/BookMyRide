import { VehicleCategory } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class ListVehiclesQueryDto {
  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory

  @IsOptional()
  @IsString()
  search?: string
}
