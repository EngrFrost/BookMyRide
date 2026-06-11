import { Controller, Get, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { AdminService } from './admin.service'

@Controller('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats()
  }
}
