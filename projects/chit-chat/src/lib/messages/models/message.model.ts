import {
	MapResult,
	MapResultCollection,
} from 'chit-chat/src/lib/utils';
import { DtoMessage } from '../dto/message.dto';
import { MessageContent } from '../types';

export class Message implements DtoMessage {
	id: string;
	isGroupMessage: boolean;
	groupId?: string;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	sendAt: string;
	seenAt?: string | null;
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
		sendAt: string,
		seenAt?: string | null,
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
		if (!obj.senderId || !obj.recipientId)
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
				obj.sendAt,
				obj.seenAt,
				obj.groupId
			),
		};
	};

	public static fromDtoCollection = (
		collection: (DtoMessage & { id: string })[]
	): MapResultCollection<DtoMessage, Message> => {
		const mapResult = collection.map((message) =>
			Message.fromDto(message.id, message)
		);

		const messages = mapResult
			.map((result) => result.data)
			.filter((message): message is Message => Boolean(message));

		const errors = mapResult.filter((result) =>
			Boolean(result.error)
		);

		return { data: messages, errors: errors };
	};
}
