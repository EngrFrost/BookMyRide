import { IsISO8601, IsUUID } from 'class-validator'

export class CreateBookingDto {
  @IsUUID()
  vehicleId!: string

  @IsISO8601()
  startTime!: string
}
