import {
	MapResult,
	MapResultCollection,
} from 'chit-chat/src/lib/utils';
import { DtoMessage } from '../dto/message.dto';
import { MessageContent } from '../types';

export class Message implements DtoMessage {
	id: string;
	isGroupMessage: boolean;
	senderId: string;
	recipientId: string;
	message: MessageContent;
	isSeen: boolean;
	seenAtMs?: number | null;
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
		seenAtMs?: number | null
	) {
		this.id = id;
		this.isGroupMessage = isGroupMessage;
		this.senderId = senderId;
		this.recipientId = recipientId;
		this.message = message;
		this.isEdited = isEdited;
		this.isDeleted = isDeleted;
		this.isSeen = isSeen;
		this.seenAtMs = seenAtMs;
	}

	public static fromDto = (
		id: string,
		obj: DtoMessage
	): MapResult<Message> => {
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
				obj.seenAtMs
			),
		};
	};

	public static fromDtoCollection = (
		collection: (DtoMessage & { id: string })[]
	): MapResultCollection<Message> => {
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
