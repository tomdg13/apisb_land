import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, Request,
  UseGuards, UseInterceptors, UploadedFiles,
  HttpException, HttpStatus, BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ListingsService } from 'src/service/listings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateListingDto, UpdateListingDto,
  LandDetailDto, CreateInquiryDto, ListingQueryDto,
} from 'src/dto/listings.dto';

// ── Multer config ──────────────────────────────────────────────
const imageStorage = diskStorage({
  destination: './uploads/listings',
  filename: (_req, files, cb) => {
    cb(null, `${uuid()}${extname(files.originalname)}`);
  },
});
const imageFilter = (_req: any, files: Express.Multer.File, cb: any) => {
  if (!files.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(new BadRequestException('Only JPG, PNG, WEBP images allowed'), false);
  }
  cb(null, true);
};

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly config: ConfigService,
  ) {}

  private get appUrl() {
    return this.config.get('APP_URL', 'http://localhost:3000');
  }

  // ── PUBLIC ─────────────────────────────────────────────────

  /**
   * GET /api/listings
   * ?page=1&limit=12&category_id=1&province_id=1
   * &listing_type=sale&min_price=&max_price=&search=&sort_by=price&sort_order=ASC
   */
  @Get()
  async getAll(@Query() query: ListingQueryDto) {
    return this.listingsService.getAll(query);
  }

  /**
   * GET /api/listings/categories
   */
  @Get('categories')
  async getCategories() {
    return this.listingsService.getCategories();
  }

  /**
   * GET /api/listings/provinces
   */
  @Get('provinces')
  async getProvinces() {
    return this.listingsService.getProvinces();
  }

  /**
   * GET /api/listings/provinces/:id/districts
   */
  @Get('provinces/:id/districts')
  async getDistricts(@Param('id') id: number) {
    return this.listingsService.getDistricts(id);
  }

  /**
   * GET /api/listings/districts/:id/villages
   */
  @Get('districts/:id/villages')
  async getVillages(@Param('id') id: number) {
    return this.listingsService.getVillages(id);
  }

  /**
   * GET /api/listings/packages
   */
  @Get('packages')
  async getPackages() {
    return this.listingsService.getPackages();
  }

  /**
   * POST /api/listings/inquiries  (guest or logged in)
   */
  @Post('inquiries')
  async createInquiry(@Body() dto: CreateInquiryDto, @Request() req: any) {
    const userId = req.user?.userId;
    return this.listingsService.createInquiry(dto, userId);
  }

  /**
   * GET /api/listings/:id  (public — increments views)
   */
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.listingsService.getOne(id);
  }

  // ── PROTECTED ──────────────────────────────────────────────

  /**
   * GET /api/listings/my/list
   */
  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  async getMyListings(@Request() req: any, @Query() query: ListingQueryDto) {
    return this.listingsService.getMyListings(req.user.userId, query);
  }

  /**
   * GET /api/listings/my/favorites
   */
  @Get('my/favorites')
  @UseGuards(JwtAuthGuard)
  async getMyFavorites(@Request() req: any) {
    return this.listingsService.getMyFavorites(req.user.userId);
  }

  /**
   * POST /api/listings
   * Body: CreateListingDto
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateListingDto, @Request() req: any) {
    try {
      return await this.listingsService.create(dto, req.user.userId);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/listings/:id
   * Body: UpdateListingDto
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateListingDto,
    @Request() req: any,
  ) {
    try {
      return await this.listingsService.update(id, dto, req.user.userId, req.user.role);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/listings/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    try {
      return await this.listingsService.remove(id, req.user.userId, req.user.role);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/listings/:id/approve  (Admin/Manager)
   */
  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approve(@Param('id') id: number) {
    return this.listingsService.approve(id);
  }

  /**
   * PUT /api/listings/:id/reject  (Admin/Manager)
   * Body: { reason: '...' }
   */
  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  async reject(@Param('id') id: number, @Body() body: { reason: string }) {
    return this.listingsService.reject(id, body.reason);
  }

  // ── IMAGES ─────────────────────────────────────────────────

  /**
   * POST /api/listings/:id/images
   * form-data: files[] (max 10, jpg/png/webp, 5MB each)
   */
  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: imageStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImages(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return this.listingsService.addImages(
      id, files, req.user.userId, req.user.role, this.appUrl,
    );
  }

  /**
   * DELETE /api/listings/images/:imageId
   */
  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Param('imageId') imageId: number, @Request() req: any) {
    return this.listingsService.deleteImage(imageId, req.user.userId, req.user.role);
  }

  /**
   * PATCH /api/listings/images/:imageId/cover
   */
  @Patch('images/:imageId/cover')
  @UseGuards(JwtAuthGuard)
  async setCover(@Param('imageId') imageId: number, @Request() req: any) {
    return this.listingsService.setCover(imageId, req.user.userId, req.user.role);
  }

  // ── LAND DETAIL ────────────────────────────────────────────

  /**
   * POST /api/listings/:id/land-detail
   * Body: LandDetailDto
   */
  @Post(':id/land-detail')
  @UseGuards(JwtAuthGuard)
  async saveLandDetail(
    @Param('id') id: number,
    @Body() dto: LandDetailDto,
    @Request() req: any,
  ) {
    return this.listingsService.saveLandDetail(id, dto, req.user.userId, req.user.role);
  }

  // ── FAVORITES ──────────────────────────────────────────────

  /**
   * POST /api/listings/:id/favorite  (toggle)
   */
  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(@Param('id') id: number, @Request() req: any) {
    return this.listingsService.toggleFavorite(id, req.user.userId);
  }

  // ── INQUIRIES ──────────────────────────────────────────────

  /**
   * GET /api/listings/:id/inquiries  (owner/admin)
   */
  @Get(':id/inquiries')
  @UseGuards(JwtAuthGuard)
  async getInquiries(@Param('id') id: number, @Request() req: any) {
    return this.listingsService.getInquiries(id, req.user.userId, req.user.role);
  }
}