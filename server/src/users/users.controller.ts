import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { Role, type User } from '@prisma/client'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { SetUserActiveDto } from './dto/set-user-active.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  listUsers() {
    return this.usersService.findAll()
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, dto.role)
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  setActive(@Param('id') id: string, @Body() dto: SetUserActiveDto) {
    return this.usersService.setActive(id, dto.isActive)
  }
}
