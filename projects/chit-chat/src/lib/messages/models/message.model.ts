import {
	MapResult,
	MapResultCollection,
} from 'chit-chat/src/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { DtoMessage } from '../dto/message.dto';
import { MessageContent } from '../types';

export class Message {
	id: string;
	isGroupMessage: boolean;
	groupId?: string;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	sendAt: Date;
	seenAt?: Date | null;
	isEdited: boolean;
	isDeleted: boolean;

	constructor(
		id: string,
		isGroupMessage: boolean,
		senderId: string,
		recipientId: string,
		message: MessageContent,
		isEdited: boolean,
		isDeleted: boolean,
		isSeen: boolean,
		sendAt: Date,
		seenAt?: Date | null,
		groupId?: string
	) {
		this.id = id;
		this.isGroupMessage = isGroupMessage;
		this.senderId = senderId;
		this.recipientId = recipientId;
		this.message = message;
		this.isEdited = isEdited;
		this.isDeleted = isDeleted;
		this.isSeen = isSeen;
		this.sendAt = sendAt;
		this.seenAt = seenAt;
		this.groupId = groupId;
	}

	public static fromDto = (
		id: string,
		obj: DtoMessage
	): MapResult<DtoMessage, Message> => {
		if (
			!obj.senderId ||
			!obj.recipientId ||
			!(obj.sendAt instanceof Timestamp) ||
			(!!obj.seenAt && !(obj.seenAt instanceof Timestamp))
		)
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${obj} to a valid Message object`
				),
			};

		return {
			data: new Message(
				id,
				obj.isGroupMessage,
				obj.senderId,
				obj.recipientId,
				obj.message,
				obj.isEdited,
				obj.isDeleted,
				obj.isSeen,
				obj.sendAt.toDate(),
				!!obj.seenAt ? obj.seenAt.toDate() : null,
				obj.groupId
			),
		};
	};

	public static fromDtoCollection = (
		collection: (DtoMessage & { id: string })[]
	): MapResultCollection<DtoMessage, Message> => {
		const result = collection.reduce(
			(acc: MapResultCollection<DtoMessage, Message>, message) => {
				const mappedMessage = Message.fromDto(message.id, message);
				if (mappedMessage.error) {
					acc.errors.push(mappedMessage);
				} else {
					acc.data.push(mappedMessage.data!);
				}
				return acc;
			},
			{ data: [], errors: [] } as MapResultCollection<
				DtoMessage,
				Message
			>
		);

		return result;
	};
}
