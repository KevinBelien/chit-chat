import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'ch-chit-chat',
	standalone: true,
	imports: [CommonModule, IonicModule],
	templateUrl: './chit-chat.component.html',
	styleUrls: ['./chit-chat.component.scss'],
})
export class ChitChatComponent {}
