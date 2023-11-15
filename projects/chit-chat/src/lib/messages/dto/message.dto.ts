import { MessageContent } from '../types/message-content.type';

export interface DtoMessage {
	isGroupMessage: boolean;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	seenAtMs?: number | null;
	isEdited: boolean;
	isDeleted: boolean;
}
