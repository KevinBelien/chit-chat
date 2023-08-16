import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';

import {
	BrowserModule,
	bootstrapApplication,
} from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChitChatModule } from 'chit-chat';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { environment } from './environments/environment';
if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(
			RouterModule.forRoot(routes, {
				useHash: true,
				preloadingStrategy: PreloadAllModules,
			})
		),
		importProvidersFrom(
			ChitChatModule.forRoot({
				firebaseConfig: environment.FIREBASE_CONFIG,
			})
		),
		importProvidersFrom(
			provideFirebaseApp(() =>
				initializeApp(environment.FIREBASE_CONFIG)
			)
		),
		importProvidersFrom(provideAuth(() => getAuth())),
		importProvidersFrom(
			AngularFireModule.initializeApp(environment.FIREBASE_CONFIG)
		),

		importProvidersFrom(IonicModule.forRoot()),
		importProvidersFrom(BrowserModule, BrowserAnimationsModule),
		provideHttpClient(),
	],
}).catch((err) => console.error(err));
