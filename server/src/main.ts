import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { AppModule } from './app.module'
import { VehiclesService } from './vehicles/vehicles.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  mkdirSync(VehiclesService.uploadsDir(), { recursive: true })
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads',
  })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  })

  const port = process.env.PORT ?? 3000
  await app.listen(port)
}

bootstrap()
