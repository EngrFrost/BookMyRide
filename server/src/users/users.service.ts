import { Injectable, NotFoundException } from '@nestjs/common'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { Role, type User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromFirebase(decoded: DecodedIdToken): Promise<User> {
    const email = decoded.email
    if (!email) {
      throw new Error('Firebase token missing email')
    }

    const displayName =
      decoded.name ?? email.split('@')[0] ?? 'User'

    return this.prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email,
        displayName,
        photoUrl: decoded.picture ?? null,
      },
      create: {
        firebaseUid: decoded.uid,
        email,
        displayName,
        photoUrl: decoded.picture ?? null,
        role: Role.CUSTOMER,
      },
    })
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async updateRole(id: string, role: Role): Promise<User> {
    await this.ensureExists(id)
    return this.prisma.user.update({ where: { id }, data: { role } })
  }

  async setActive(id: string, isActive: boolean): Promise<User> {
    await this.ensureExists(id)
    return this.prisma.user.update({ where: { id }, data: { isActive } })
  }

  private async ensureExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
  }
}
