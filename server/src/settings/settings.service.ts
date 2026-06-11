import { Injectable } from '@nestjs/common'
import type { AppSettings } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import type { UpdateSettingsDto } from './dto/update-settings.dto'

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  get(): Promise<AppSettings> {
    return this.prisma.appSettings.findUniqueOrThrow({ where: { id: 'default' } })
  }

  update(dto: UpdateSettingsDto): Promise<AppSettings> {
    return this.prisma.appSettings.update({
      where: { id: 'default' },
      data: dto,
    })
  }
}
