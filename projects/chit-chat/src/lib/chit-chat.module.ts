import { CommonModule, DOCUMENT } from '@angular/common';
import { Inject, ModuleWithProviders, NgModule } from '@angular/core';
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
import { ScreenService } from 'chit-chat/src/lib/utils';

@NgModule({
	declarations: [],
	imports: [CommonModule, AngularFireModule, AngularFirestoreModule],
})
export class ChitChatModule {
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private screenService: ScreenService
	) {
		if (this.screenService.isMobile())
			this.document.body.classList.add('ch-scroll-mobile');
	}
	static forRoot(
		config: LibConfig
	): ModuleWithProviders<ChitChatModule> {
		return {
			ngModule: ChitChatModule,
			providers: [
				AuthService,
				ScreenService,
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
