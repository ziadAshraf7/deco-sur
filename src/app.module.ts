import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TestimonialModule } from './testimonials/testimonials.module';
import { FaqModule } from './faq/faq.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './shared/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule, UsersModule, AuthModule, ProjectsModule, TestimonialModule, FaqModule],
  controllers: [AppController],
})
export class AppModule {}
