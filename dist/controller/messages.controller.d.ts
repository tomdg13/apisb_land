import { MessagesService } from 'src/service/messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    start(body: {
        listing_id: number;
        message?: string;
    }, req: any): Promise<any>;
    send(conversationId: number, body: {
        message: string;
    }, req: any): Promise<any>;
    getMessages(id: number, req: any): Promise<any>;
    getConversations(req: any): Promise<any>;
    unreadCount(req: any): Promise<any>;
}
