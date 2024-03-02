import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessageBoardComponent } from 'chit-chat/src/lib/components/message-board';
import { MessageInputComponent } from 'chit-chat/src/lib/components/message-input';

@Component({
	selector: 'ch-chat',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		MessageBoardComponent,
		MessageInputComponent,
	],
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChatComponent implements OnInit {
	@Input()
	chatContext: { isGroup: boolean; participantId: string } | null =
		null;

	constructor() {}

	ngOnInit(): void {}
}
