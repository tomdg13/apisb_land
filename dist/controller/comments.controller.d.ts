import { CommentsService } from 'src/service/comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getComments(listingId: number, req: any): Promise<any>;
    addComment(listingId: number, body: {
        comment_text: string;
        parent_id?: number;
    }, req: any): Promise<any>;
    deleteComment(commentId: number, req: any): Promise<any>;
    toggleLike(commentId: number, req: any): Promise<any>;
}
export declare class CommentLikeController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    toggleLike(commentId: number, req: any): Promise<any>;
    approve(commentId: number, body: {
        approved: boolean;
    }): Promise<any>;
}
