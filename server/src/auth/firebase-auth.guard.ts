import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { FirebaseService } from './firebase.service'
import { UsersService } from '../users/users.service'
import type { AuthenticatedRequest } from '../common/decorators/current-user.decorator'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const token = extractBearerToken(request)
    if (!token) {
      throw new UnauthorizedException('Missing authorization token')
    }

    if (!this.firebase.isConfigured) {
      throw new UnauthorizedException('Firebase auth is not configured on the server')
    }

    try {
      const decoded = await this.firebase.verifyIdToken(token)
      const user = await this.usersService.upsertFromFirebase(decoded)
      if (!user.isActive) {
        throw new UnauthorizedException('Account is disabled')
      }
      request.user = user
      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error
      throw new UnauthorizedException('Invalid or expired ID token')
    }
  }
}

function extractBearerToken(request: Request): string | null {
  const header = request.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}
