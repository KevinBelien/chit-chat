import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
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

import {
	AutoSizeVirtualScrollStrategy,
	RxVirtualFor,
	RxVirtualScrollViewportComponent,
} from '@rx-angular/template/experimental/virtual-scrolling';

import { AuthUser } from 'chit-chat/src/lib/users';

@Component({
	selector: 'ch-message-board',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		RxVirtualFor,
		RxVirtualScrollViewportComponent,
		AutoSizeVirtualScrollStrategy,
	],
	templateUrl: './message-board.component.html',
	styleUrls: ['./message-board.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class MessageBoardComponent
	implements OnInit, OnChanges, OnDestroy
{
	@ViewChild(RxVirtualScrollViewportComponent, { static: false })
	viewport?: RxVirtualScrollViewportComponent;

	@Input()
	scrollTreshold: number = 3000;

	@Input()
	initialBatchSize: number = 40;

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

	itemsRendered = new Subject<Message[]>();

	currentUser$: Observable<AuthUser | null>;
	messages$?: Observable<Message[]>;

	lastMessage$: BehaviorSubject<Message | null> =
		new BehaviorSubject<Message | null>(null);
	lastMessageFetched: boolean = false;
	lastRange: number | null = null;
	firstFetch: boolean = true;

	isLoading: boolean = false;

	renderedMessages = new Set<Message>();
	viewRange: { start: number; end: number } | null = null;

	private destroyMessages$: Subject<void> = new Subject<void>();
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
		private messageService: MessageService,
		private authService: AuthService,
		private cd: ChangeDetectorRef
	) {
		this.currentUser$ = this.authService.user$;
		this.currentUser$
			.pipe(takeUntil(this.destroy$))
			.subscribe((currentUser) => this.resetMessageStream());

		this.itemsRendered.subscribe((messages) => {
			this.renderedMessages = new Set([
				...this.renderedMessages,
				...messages,
			]);
		});
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
		this.destroyMessages$.next();
		this.destroyMessages$.complete();
		this.destroy$.next();
		this.destroy$.complete();
	}

	private resetMessageStream(): void {
		this.destroyMessages$.next();
		this.firstFetch = true;
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
			throttleTime(100),
			mergeMap(([currentUser, lastMessage, chatContext]) => {
				if (!chatContext || !currentUser) {
					return of([] as Message[]) as Observable<Message[]>;
				}

				this.isLoading = true;

				return this.messageService.getMessages(
					{
						userId: currentUser.userInfo.uid,
						participantId: chatContext.participantId,
						isGroup: chatContext.isGroup,
					},
					lastMessage,
					!!this.firstFetch ? this.initialBatchSize : this.batchSize
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
				return [
					...messages.sort(
						(a: Message, b: Message) =>
							a.sendAt.getTime() - b.sendAt.getTime()
					),
				];
			}),
			tap((messages: Message[]) => {
				this.isLoading = false;

				//TODO: scroll to bottom not consistent
				if (this.firstFetch && messages.length > 0)
					setTimeout(() => {
						try {
							this.viewport?.scrollToIndex(messages.length - 1);
							setTimeout(() => {
								this.firstFetch = false;
							}, 300);
						} catch (e: any) {}
					});
			})
		);
	};

	trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	handleViewRangeChanged = (listRange: {
		start: number;
		end: number;
	}) => {
		this.viewRange = { ...listRange };
	};

	handleScrollIndexChange = (
		lastMessageIndex: number,
		lastMessage: Message,
		messagesLength: number
	) => {
		if (this.firstFetch || this.isLoading || this.lastMessageFetched)
			return;

		if (
			messagesLength <= this.renderedMessages.size ||
			lastMessageIndex < 5
		) {
			this.lastMessage$.next(lastMessage);
		}
	};
}
