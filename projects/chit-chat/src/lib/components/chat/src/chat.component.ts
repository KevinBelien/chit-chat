import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { Message, MessageService } from 'chit-chat/src/lib/messages';

import {
	BehaviorSubject,
	Observable,
	Subject,
	combineLatest,
	map,
	mergeMap,
	of,
	scan,
	takeUntil,
	tap,
	throttleTime,
} from 'rxjs';

import { AuthUser } from 'chit-chat/src/lib/users';

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
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
	@ViewChild(CdkVirtualScrollViewport)
	viewport?: CdkVirtualScrollViewport;

	@Input()
	chatContext: { isGroup: boolean; participantId: string } | null =
		null;

	messages$?: Observable<Message[]>;
	lastMessage: BehaviorSubject<Message | null> =
		new BehaviorSubject<Message | null>(null);

	context: BehaviorSubject<{
		isGroup: boolean;
		participantId: string;
	} | null> = new BehaviorSubject<{
		isGroup: boolean;
		participantId: string;
	} | null>(null);

	private destroy$: Subject<void> = new Subject<void>();

	lastMessageFetched: boolean = false;
	firstFetch: boolean = true;

	currentUser$: Observable<AuthUser | null>;

	isLoading: boolean = false;

	constructor(
		private messageService: MessageService,
		private authService: AuthService
	) {
		this.currentUser$ = this.authService.user;
		this.currentUser$.pipe(tap(() => this.resetMessageStream()));
	}

	ngOnInit(): void {
		this.initializeMessagesStream();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['chatContext'] &&
			changes['chatContext'].currentValue !==
				changes['chatContext'].previousValue
		) {
			this.resetMessageStream();
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private resetMessageStream(): void {
		this.destroy$.next();
		this.lastMessage.next(null);
		this.lastMessageFetched = false;
		this.firstFetch = true;
		this.context.next(this.chatContext);
		this.initializeMessagesStream();
	}

	initializeMessagesStream = (): void => {
		this.messages$ = combineLatest([
			this.currentUser$,
			this.lastMessage,
			this.context,
		]).pipe(
			takeUntil(this.destroy$),
			throttleTime(500),
			mergeMap(([currentUser, lastMessage, chatContext]) => {
				if (!chatContext || !currentUser) {
					return of([] as Message[]) as Observable<Message[]>;
				}

				this.isLoading = true;

				return this.messageService.getMessages(
					{
						users: [
							currentUser.userInfo.uid,
							chatContext.participantId,
						],
						isGroup: chatContext.isGroup,
					},
					lastMessage,
					20
				) as Observable<Message[]>;
			}),
			tap((messages: Message[]) => {
				this.lastMessageFetched = messages.length === 0;
			}),

			map((messages) => {
				return messages.reduce((acc, cur) => {
					return { ...acc, [cur.id]: cur };
				}, {});
			}),
			scan((acc: any, batch) => {
				// Merge new messages with the existing ones
				const mergedMessages = { ...acc, ...batch };
				return mergedMessages;
			}, {}),
			map((scanResult) => Object.values(scanResult) as Message[]),
			map((messages: any) => {
				return messages.sort(
					(a: Message, b: Message) =>
						a.sendAt.getTime() - b.sendAt.getTime()
				);
			}),
			tap((result) => {
				if (this.firstFetch) setTimeout(() => this.scrollToBottom());
				if (result.length > 0) this.firstFetch = false;

				this.isLoading = false;
			})
		);
	};

	trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	onScroll = (e: any, lastMessage: Message | null) => {
		const distanceFromTop = this.viewport?.measureScrollOffset('top');

		if (
			!!distanceFromTop &&
			distanceFromTop < 1500 &&
			!this.isLoading &&
			!this.lastMessageFetched
		) {
			this.lastMessage.next(lastMessage);
		}
	};

	scrollToBottom() {
		if (!!this.viewport) {
			this.viewport.scrollTo({ bottom: 0 });
		}
	}
}
