import { IsInt, IsOptional, Min } from 'class-validator'

export class UpdateSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAdvanceBookingDays?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  maxActiveBookingsPerUser?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  minHoursBeforeBooking?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  cancellationWindowHours?: number
}
