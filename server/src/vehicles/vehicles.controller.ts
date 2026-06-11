import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Role } from '@prisma/client'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { BookingsService } from '../bookings/bookings.service'
import { AvailabilityQueryDto } from './dto/availability-query.dto'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { VehiclesService } from './vehicles.service'

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Get()
  list(@Query() query: ListVehiclesQueryDto) {
    return this.vehiclesService.list(query)
  }

  @Get(':id/availability')
  availability(@Param('id') id: string, @Query() query: AvailabilityQueryDto) {
    return this.bookingsService.getAvailability(id, query.from, query.to)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id)
  }

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto)
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id)
  }

  @Post(':id/photo')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: VehiclesService.uploadsDir(),
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          cb(null, `${unique}${extname(file.originalname)}`)
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new Error('Only image files are allowed'), false)
          return
        }
        cb(null, true)
      },
    }),
  )
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Photo file is required')
    return this.vehiclesService.setPhoto(id, file.filename)
  }
}
