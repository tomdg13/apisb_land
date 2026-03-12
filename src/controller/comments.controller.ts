import { Controller, Get, Post, Delete, Patch, Param, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalAuth } from 'src/auth/decorators';
import { CommentsService } from 'src/service/comments.service';

@Controller('listings/:listingId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // GET /api/listings/:listingId/comments  (public, but shows is_liked if logged in)
  @Get()
  @UseGuards(JwtAuthGuard)
  @OptionalAuth()
  async getComments(@Param('listingId') listingId: number, @Request() req: any) {
    const userId = req.user?.userId ?? null;
    return this.commentsService.getComments(listingId, userId);
  }

  // POST /api/listings/:listingId/comments
  // { comment_text, parent_id? }
  @Post()
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('listingId') listingId: number,
    @Body() body: { comment_text: string; parent_id?: number },
    @Request() req: any,
  ) {
    return this.commentsService.addComment(
      listingId, req.user.userId, body.comment_text, body.parent_id,
    );
  }

  // DELETE /api/listings/:listingId/comments/:commentId
  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('commentId') commentId: number,
    @Request() req: any,
  ) {
    return this.commentsService.deleteComment(commentId, req.user.userId, req.user.role);
  }

  // POST /api/listings/:listingId/comments/:commentId/like  (toggle)
  @Post(':commentId/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Param('commentId') commentId: number, @Request() req: any) {
    return this.commentsService.toggleLike(commentId, req.user.userId);
  }
}

// ── Standalone like route: POST /api/comments/:commentId/like ──
@Controller('comments')
export class CommentLikeController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':commentId/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Param('commentId') commentId: number, @Request() req: any) {
    return this.commentsService.toggleLike(commentId, req.user.userId);
  }

  // PATCH /api/listings/:listingId/comments/:commentId/approve  (Admin)
  @Patch(':commentId/approve')
  @UseGuards(JwtAuthGuard)
  async approve(@Param('commentId') commentId: number, @Body() body: { approved: boolean }) {
    return this.commentsService.setApproved(commentId, body.approved);
  }
}