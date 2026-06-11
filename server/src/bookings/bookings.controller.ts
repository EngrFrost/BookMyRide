import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import type { User } from '@prisma/client'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { BookingsService } from './bookings.service'
import { CancelBookingDto } from './dto/cancel-booking.dto'
import { CreateBookingDto } from './dto/create-booking.dto'
import { ListBookingsQueryDto } from './dto/list-bookings-query.dto'

@Controller('bookings')
@UseGuards(FirebaseAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto, user)
  }

  @Get('me')
  listMine(@CurrentUser() user: User) {
    return this.bookingsService.listMine(user.id)
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  listAll(@Query() query: ListBookingsQueryDto) {
    return this.bookingsService.listAll(query)
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, user, dto.reason)
  }

  @Patch(':id/no-show')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  markNoShow(@Param('id') id: string) {
    return this.bookingsService.markNoShow(id)
  }
}
