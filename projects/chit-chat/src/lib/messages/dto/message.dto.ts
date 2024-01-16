import { MessageContent } from '../types/message-content.type';

export interface DtoMessage {
	isGroupMessage: boolean;
	groupId?: string;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	seenAt?: string | null;
	sendAt: string;
	isEdited: boolean;
	isDeleted: boolean;
}
