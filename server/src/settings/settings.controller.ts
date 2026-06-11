import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { UpdateSettingsDto } from './dto/update-settings.dto'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.get()
  }

  @Patch()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto)
  }
}
