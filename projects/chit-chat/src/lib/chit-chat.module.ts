import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
	AngularFireModule,
	FIREBASE_OPTIONS,
} from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthService } from 'chit-chat/src/lib/auth';
import {
	LibConfig,
	LibConfigService,
} from 'chit-chat/src/lib/lib-config';

@NgModule({
	declarations: [],
	imports: [CommonModule, AngularFireModule, AngularFirestoreModule],
})
export class ChitChatModule {
	static forRoot(
		config: LibConfig
	): ModuleWithProviders<ChitChatModule> {
		return {
			ngModule: ChitChatModule,
			providers: [
				AuthService,
				{
					provide: FIREBASE_OPTIONS,
					useValue: config.firebaseConfig,
				},
				{
					provide: LibConfigService,
					useValue: config,
				},
			],
		};
	}
}
