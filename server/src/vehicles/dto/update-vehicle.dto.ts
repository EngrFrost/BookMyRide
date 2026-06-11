import { VehicleCategory, VehicleStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsString, IsUrl, MinLength } from 'class-validator'

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsUrl()
  imageUrl?: string

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus
}
