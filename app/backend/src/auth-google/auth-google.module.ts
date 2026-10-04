import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key_change_me',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRATION || '7d') as any,
      },
    }),
    PrismaModule,
  ],
  controllers: [AuthGoogleController],
  providers: [GoogleStrategy, AuthGoogleService],
  exports: [AuthGoogleService],
})
export class AuthGoogleModule {}