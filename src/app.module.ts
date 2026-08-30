import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TestimonialModule } from './testimonials/testimonials.module';
import { FaqModule } from './faq/faq.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',

      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },

      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
    }),

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
