import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BookingsService } from './bookings.service'

@Injectable()
export class BookingsCron {
  private readonly logger = new Logger(BookingsCron.name)

  constructor(private readonly bookingsService: BookingsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async completePastBookings() {
    const count = await this.bookingsService.markCompletedPastBookings()
    if (count > 0) {
      this.logger.log(`Marked ${count} booking(s) as COMPLETED`)
    }
  }
}
