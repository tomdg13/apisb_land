import {
  Controller, Get, Put, Post, Patch,
  Body, Param, Request, UseGuards,
  UseInterceptors, UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuth } from 'src/auth/decorators';
import { ProfileService } from 'src/service/profile.service';

const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: (_req, file, cb) =>
    cb(null, `${uuid()}${extname(file.originalname)}`),
});

const coverStorage = diskStorage({
  destination: './uploads/covers',
  filename: (_req, file, cb) =>
    cb(null, `${uuid()}${extname(file.originalname)}`),
});

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly config: ConfigService,
  ) {}

  private get appUrl() {
    return this.config.get('APP_URL', 'http://localhost:3000');
  }

  // GET /api/profile/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req: any) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  // GET /api/profile/:userId  (public)
  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  async getProfile(@Param('userId') userId: number, @Request() req: any) {
    return this.profileService.getProfile(userId, req.user?.userId ?? null);
  }

  // PUT /api/profile/me
  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() body: any, @Request() req: any) {
    return this.profileService.updateProfile(req.user.userId, body);
  }

  // POST /api/profile/me/avatar
  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: avatarStorage,
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/))
        return cb(new BadRequestException('Images only'), false);
      cb(null, true);
    },
    limits: { fileSize: 3 * 1024 * 1024 },
  }))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const url = `${this.appUrl}/uploads/avatars/${file.filename}`;
    return this.profileService.updateAvatar(req.user.userId, url);
  }

  // POST /api/profile/me/cover
  @Post('me/cover')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cover', {
    storage: coverStorage,
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/))
        return cb(new BadRequestException('Images only'), false);
      cb(null, true);
    },
    limits: { fileSize: 8 * 1024 * 1024 },
  }))
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const url = `${this.appUrl}/uploads/covers/${file.filename}`;
    return this.profileService.updateCoverUrl(req.user.userId, url);
  }

  // PATCH /api/profile/me/password
  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: { current_password: string; new_password: string },
    @Request() req: any,
  ) {
    if (!body.new_password || body.new_password.length < 6)
      throw new BadRequestException('Password must be at least 6 characters');
    return this.profileService.changePassword(
      req.user.userId, body.current_password, body.new_password,
    );
  }

  // POST /api/profile/:userId/review
  @Post(':userId/review')
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Param('userId') sellerId: number,
    @Body() body: { rating: number; review_text?: string; listing_id?: number },
    @Request() req: any,
  ) {
    return this.profileService.addReview(
      sellerId, req.user.userId,
      body.rating, body.review_text ?? '',
      body.listing_id,
    );
  }

 
  

}
