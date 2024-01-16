import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Message, MessageService } from 'chit-chat/src/lib/messages';

@Component({
	selector: 'ch-chat',
	standalone: true,
	imports: [CommonModule, IonicModule, ScrollingModule],
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChatComponent implements OnChanges, AfterViewInit {
	@ViewChild(CdkVirtualScrollViewport)
	viewport?: CdkVirtualScrollViewport;

	@Input()
	chatContext?: { isGroup: boolean; participantId: string };

	messages$?: Message[];

	isLoading: boolean = false;

	constructor(private messageService: MessageService) {
		this.messages$ = this.messageService.getMockData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// if (changes['chatContext']) {
		// 	this.messages$ = !!this.chatContext ? [] : undefined;
		// }
	}

	ngAfterViewInit() {
		// Scroll to the bottom of the chat when the component initializes
		this.scrollToBottom();
	}

	trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	onScroll = (e: any) => {
		const distanceFromTop = this.viewport?.measureScrollOffset('top');
		if (
			!!distanceFromTop &&
			distanceFromTop < 1800 &&
			!this.isLoading
		) {
			this.isLoading = true;
			console.log('gets here to fetch messages');
			// this.fetchMessages(); // Fetch new messages when close to the top and not currently fetching
		}
	};

	scrollToBottom() {
		if (!!this.viewport) {
			// Timeout to ensure the view is rendered before scrolling
			setTimeout(() => {
				this.viewport!.scrollTo({ bottom: 0 });
			}, 200);
		}
	}

	// onIonInfinite = async (e: any) => {
	// 	console.log('gets to infinite');
	// 	setTimeout(() => {
	// 		(e as InfiniteScrollCustomEvent).target.complete();
	// 	}, 200);
	// };
}
