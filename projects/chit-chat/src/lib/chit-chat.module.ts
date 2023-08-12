
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChitChatComponent } from './chit-chat.component';
import { ChatService } from './services';

export interface LibConfig {
  firebaseConfig: {
    apiKey: string,
		authDomain: string,
		databaseURL: string,
		projectId: string,
		storageBucket: string,
		messagingSenderId: string,
		appId: string,
		measurementId: string,
  }
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [
    ChitChatComponent
  ],
imports: [
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [
    ChitChatComponent
  ]
})
export class ChitChatModule {
  static forRoot(config: LibConfig): ModuleWithProviders<ChitChatModule> {
    return {
      ngModule: ChitChatModule,
      providers: [
        ChatService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  } }
