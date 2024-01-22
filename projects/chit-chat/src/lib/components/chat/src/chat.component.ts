import {
	CdkVirtualScrollViewport,
	ScrollDispatcher,
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
	filter,
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
	@ViewChild(CdkVirtualScrollViewport, { static: false })
	viewport?: CdkVirtualScrollViewport;

	@Input()
	batchSize: number = 20;

	@Input()
	chatContext: { isGroup: boolean; participantId: string } | null =
		null;

	chatContext$: BehaviorSubject<{
		isGroup: boolean;
		participantId: string;
	} | null> = new BehaviorSubject<{
		isGroup: boolean;
		participantId: string;
	} | null>(null);

	viewportId: string = `chat-list-viewport-${crypto.randomUUID()}`;

	currentUser$: Observable<AuthUser | null>;
	messages$?: Observable<Message[]>;

	lastMessage$: BehaviorSubject<Message | null> =
		new BehaviorSubject<Message | null>(null);
	currentLastMessage: Message | null = null;
	lastMessageFetched: boolean = false;
	firstFetch: boolean = true;

	isLoading: boolean = false;

	private destroyMessages$: Subject<void> = new Subject<void>();
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
		private messageService: MessageService,
		private authService: AuthService,
		private scrollDispatcher: ScrollDispatcher
	) {
		this.currentUser$ = this.authService.user$;
		this.currentUser$
			.pipe(takeUntil(this.destroy$))
			.subscribe((currentUser) => this.resetMessageStream());
	}

	ngOnInit(): void {
		this.scrollDispatcher
			.scrolled()
			.pipe(
				takeUntil(this.destroy$),
				filter(
					(event) =>
						event instanceof CdkVirtualScrollViewport &&
						event.elementRef.nativeElement.id === this.viewportId
				)
			)
			.subscribe(async (event) => {
				this.onScroll();
			});
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
		this.destroyMessages$.next();
		this.destroyMessages$.complete();
		this.destroy$.next();
		this.destroy$.complete();
	}

	private resetMessageStream(): void {
		this.destroyMessages$.next();
		this.firstFetch = true;
		this.currentLastMessage = null;
		this.lastMessageFetched = false;

		this.lastMessage$.next(null);
		this.chatContext$.next(this.chatContext);
		this.initializeMessagesStream();
	}

	initializeMessagesStream = (): void => {
		this.messages$ = combineLatest([
			this.currentUser$,
			this.lastMessage$,
			this.chatContext$,
		]).pipe(
			takeUntil(this.destroyMessages$),
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
					this.batchSize
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
				this.currentLastMessage = result[0];

				this.isLoading = false;
			})
		);
	};

	trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	onScroll = () => {
		const distanceFromTop = this.viewport?.measureScrollOffset('top');

		if (
			!!distanceFromTop &&
			distanceFromTop < 1500 &&
			!this.isLoading &&
			!this.lastMessageFetched
		) {
			this.lastMessage$.next(this.currentLastMessage);
		}
	};

	scrollToBottom() {
		if (!!this.viewport) {
			this.viewport.scrollTo({ bottom: 0 });
		}
	}
}
