import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { BookingsModule } from './bookings/bookings.module'
import { HealthModule } from './health/health.module'
import { PrismaModule } from './prisma/prisma.module'
import { SettingsModule } from './settings/settings.module'
import { UsersModule } from './users/users.module'
import { VehiclesModule } from './vehicles/vehicles.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    HealthModule,
    UsersModule,
    VehiclesModule,
    BookingsModule,
    SettingsModule,
    AdminModule,
  ],
})
export class AppModule {}
