import { Injectable } from '@angular/core';
import {
	AngularFirestore,
	DocumentChangeAction,
} from '@angular/fire/compat/firestore';
import { FireStoreCollection } from 'chit-chat/src/lib/utils';
import {
	collection,
	doc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
import { isEqual } from 'lodash-es';
import {
	Observable,
	catchError,
	distinctUntilChanged,
	map,
	of,
} from 'rxjs';
import { DtoMessage } from '../dto';
import { Message } from './../models/message.model';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	constructor(private afs: AngularFirestore) {
		// const mockData = messages.map((element: any) => {
		// 	return Object.assign({}, element, {
		// 		sendAt: element.sendAt,
		// 		seenAt: element.seenAt,
		// 	});
		// });
		// mockData.forEach((message) => {
		// 	this.sendMessage(message);
		// });
	}

	sendMessage = async (data: DtoMessage): Promise<void> => {
		const fireStore = getFirestore();
		const messagesRef = collection(
			fireStore,
			FireStoreCollection.MESSAGES
		);

		try {
			return await setDoc(
				doc(messagesRef),
				JSON.parse(JSON.stringify(data))
			);
		} catch (e: any) {
			throw Error(`Something went wrong when sending message. ${e}`);
		}
	};

	getMessages = (
		context: { users: Array<string>; isGroup: boolean },
		lastSeenMessage: Message | null,
		batchSize: number
	): Observable<Message[]> => {
		return this.afs
			.collection<DtoMessage>(FireStoreCollection.MESSAGES, (ref) => {
				let modifiedRef = ref.orderBy('sendAt', 'desc');

				if (!!lastSeenMessage) {
					modifiedRef = modifiedRef.startAfter(
						lastSeenMessage.convertToDto().sendAt
					);
				}

				modifiedRef = modifiedRef.where(
					'isGroupMessage',
					'==',
					context.isGroup
				);
				modifiedRef = modifiedRef.where('participants', 'in', [
					context.users,
				]);

				return modifiedRef.limit(batchSize);
			})
			.snapshotChanges()
			.pipe(
				distinctUntilChanged((prev, curr) => isEqual(prev, curr)),

				map<Array<DocumentChangeAction<DtoMessage>>, Message[]>(
					(result) => {
						console.log('messages', lastSeenMessage, result);
						const dtos = result.map((document) => ({
							id: document.payload.doc.id,
							...document.payload.doc.data(),
						}));
						return Message.fromDtoCollection(dtos).data;
					}
				),
				catchError((error: any) => {
					console.error(error);
					return of([] as Message[]); // Return an empty array in case of an error
				})
			);
	};
}
