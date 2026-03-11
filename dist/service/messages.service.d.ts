import { DataSource } from 'typeorm';
export declare class MessagesService {
    private dataSource;
    constructor(dataSource: DataSource);
    startOrGetConversation(listingId: number, buyerId: number, firstMessage?: string): Promise<any>;
    sendMessage(conversationId: number, senderId: number, text: string): Promise<any>;
    private _sendMessage;
    private _isBuyer;
    getMessages(conversationId: number, userId: number): Promise<any>;
    getMyConversations(userId: number): Promise<any>;
    getUnreadCount(userId: number): Promise<any>;
}
