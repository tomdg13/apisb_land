// src/app.module.ts
//open token
// import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './module/users.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './module/listings.module';
import { messagesModule } from './module/messages.module';
import { commentsModule } from './module/comments.module';
import { profileModule } from './module/profile.module';



//open token
// import { JwtMiddleware } from './auth/middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    
      TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: '209.97.172.105',
      port: 3306,
      username: 'admintra',
      password: 'miN@!2025',
      database: 'sbland',
    }),
   

    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,  // <-- add this
    ListingsModule,
    messagesModule,
    commentsModule,
    profileModule
  ],
  controllers: [],
})
export class AppModule {
  constructor(private readonly connection: DataSource) {}
  //open token
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtMiddleware).forRoutes('*'); // Apply to all routes
  // }
}


