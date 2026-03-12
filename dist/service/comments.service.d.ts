import { DataSource } from 'typeorm';
export declare class CommentsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getComments(listingId: number, userId?: number | null): Promise<any>;
    addComment(listingId: number, userId: number, text: string, parentId?: number): Promise<any>;
    deleteComment(commentId: number, userId: number, userRole: string): Promise<any>;
    toggleLike(commentId: number, userId: number): Promise<any>;
    setApproved(commentId: number, approved: boolean): Promise<any>;
}
