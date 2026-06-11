import { Global, Module } from '@nestjs/common'
import { FirebaseService } from './firebase.service'
import { FirebaseAuthGuard } from './firebase-auth.guard'
import { UsersModule } from '../users/users.module'

@Global()
@Module({
  imports: [UsersModule],
  providers: [FirebaseService, FirebaseAuthGuard],
  exports: [FirebaseService, FirebaseAuthGuard, UsersModule],
})
export class AuthModule {}
