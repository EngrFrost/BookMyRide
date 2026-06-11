import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import type { DecodedIdToken } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService implements OnModuleInit {
  private initialized = false

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (getApps().length > 0) {
      this.initialized = true
      return
    }

    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID')
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL')
    const privateKey = this.config
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n')

    if (!projectId || !clientEmail || !privateKey) {
      return
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
    this.initialized = true
  }

  get isConfigured() {
    return this.initialized
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    if (!this.initialized) {
      throw new Error('Firebase Admin SDK is not configured')
    }
    return getAuth().verifyIdToken(token)
  }
}
