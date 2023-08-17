import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
	InjectionToken,
	ModuleWithProviders,
	NgModule,
} from '@angular/core';
import {
	AngularFireModule,
	FIREBASE_OPTIONS,
} from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { IonicModule } from '@ionic/angular';
import { ChitChatComponent } from './chit-chat.component';
import { AuthService, UserService } from './services';

export interface LibConfig {
	firebaseConfig: {
		apiKey: string;
		authDomain: string;
		// databaseURL: string;
		projectId: string;
		storageBucket: string;
		messagingSenderId: string;
		appId: string;
		measurementId: string;
	};
}

export const LibConfigService = new InjectionToken<LibConfig>(
	'LibConfig'
);

@NgModule({
	declarations: [ChitChatComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		IonicModule,
		PickerComponent,
		AngularFireModule,
		AngularFirestoreModule,
	],
	exports: [ChitChatComponent],
})
export class ChitChatModule {
	static forRoot(
		config: LibConfig
	): ModuleWithProviders<ChitChatModule> {
		return {
			ngModule: ChitChatModule,
			providers: [
				AuthService,
				UserService,
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
