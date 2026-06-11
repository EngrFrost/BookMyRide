import { Module } from '@nestjs/common'
import { BookingsModule } from '../bookings/bookings.module'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'

@Module({
  imports: [BookingsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
