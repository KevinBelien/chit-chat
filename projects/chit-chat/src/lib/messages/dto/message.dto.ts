import { Timestamp } from 'firebase/firestore';
import { MessageContent } from '../types/message-content.type';

export interface DtoMessage {
	isGroupMessage: boolean;
	groupId?: string;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	seenAt?: Timestamp | null;
	sendAt: Timestamp;
	isEdited: boolean;
	isDeleted: boolean;
}
