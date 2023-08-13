import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { LibConfig, LibConfigService } from '../chit-chat.module';

@Injectable({
	providedIn: 'root',
})
export class ChatService {
	constructor(
		@Inject(LibConfigService) private config: LibConfig,
		private http: HttpClient,
		private afs: AngularFirestore
	) {
		console.log('config', config);
	}

	fetch = () => {
		return this.afs
			.collection('users')
			.snapshotChanges()
			.pipe(
				map((changes) =>
					changes.map((c) => ({
						key: c.payload.doc.id,
						...(c.payload.doc.data() as any),
					}))
				)
			);
	};
}
