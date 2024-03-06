import { CommonModule, DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { Message, MessageService } from 'chit-chat/src/lib/messages';
import { ScreenService } from 'chit-chat/src/lib/utils';

import {
	BehaviorSubject,
	Observable,
	Subject,
	combineLatest,
	lastValueFrom,
	map,
	mergeMap,
	of,
	scan,
	take,
	takeUntil,
	tap,
} from 'rxjs';

import {
	AutoSizeVirtualScrollStrategy,
	RxVirtualFor,
	RxVirtualScrollViewportComponent,
} from '@rx-angular/template/experimental/virtual-scrolling';

import { AuthUser } from 'chit-chat/src/lib/users';

import { MessageBubbleComponent } from 'chit-chat/src/lib/components/message-bubble';
import { DateHelper, SmartDatePipe } from 'chit-chat/src/lib/utils';

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
		SmartDatePipe,
		MessageBubbleComponent,
	],
	providers: [DatePipe],
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
	initialBatchSize: number = 40;

	@Input()
	batchSize: number = 20;

	@Input()
	maxWidth: number = 900;

	@Input()
	messageBubbleDimensions: { maxWidth: number | string };

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

	scrolledIndexChangedCounter: number = 0;

	@Output()
	onScrollIndexChanged = new EventEmitter<{
		messages: Message[];
		lastMessageFetched: Message;
		scrollIndex: number;
		dataPreviouslyFetching: boolean;
		viewport: RxVirtualScrollViewportComponent;
	}>();

	@Output()
	onLoadingStarted = new EventEmitter<{
		currentUser: AuthUser;
		lastMessageFetched: Message | null;
		chatContext: {
			isGroup: boolean;
			participantId: string;
		} | null;
	}>();

	@Output()
	onLoadingEnded = new EventEmitter<{
		data: Message[];
		lastMessageWasFetched: boolean;
	}>();

	private destroyMessages$: Subject<void> = new Subject<void>();
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
		private messageService: MessageService,
		private authService: AuthService,
		private screenService: ScreenService
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

		this.messageBubbleDimensions =
			this.calcDimensionsOfMessageBubble();
		this.screenService.breakPointChanged.subscribe(() => {
			this.messageBubbleDimensions =
				this.calcDimensionsOfMessageBubble();
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

	private calcDimensionsOfMessageBubble = () => {
		if (this.screenService.sizes['lg']) {
			return { maxWidth: '75%' };
		} else {
			return { maxWidth: '87%' };
		}
	};

	resetMessageStream(): void {
		this.scrolledIndexChangedCounter = 0;
		this.isLoading = true;
		this.destroyMessages$.next();
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
			mergeMap(([currentUser, lastMessage, chatContext]) => {
				if (!chatContext || !currentUser) {
					this.isLoading = false;

					return of([] as Message[]);
				}
				this.onLoadingStarted.emit({
					currentUser,
					lastMessageFetched: lastMessage,
					chatContext,
				});
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
				this.onLoadingEnded.emit({
					data: messages,
					lastMessageWasFetched: this.lastMessageFetched,
				});
			}),
			takeUntil(this.destroyMessages$)
		);
	};

	protected trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	protected handleScrollIndexChange = async (
		scrollIndex: number,
		lastMessage: Message,
		messages: Message[],
		viewport: RxVirtualScrollViewportComponent
	) => {
		this.onScrollIndexChanged.emit({
			messages,
			lastMessageFetched: lastMessage,
			scrollIndex,
			dataPreviouslyFetching: this.isLoading,
			viewport,
		});

		this.scrolledIndexChangedCounter++;
		if (
			this.scrolledIndexChangedCounter < 3 ||
			this.isLoading ||
			this.lastMessageFetched
		)
			return;

		const range = await lastValueFrom(
			viewport.viewRange.pipe(take(1))
		);

		if (range.start === 0) {
			this.lastMessage$.next(lastMessage);
		}
	};

	protected isDifferentDay = (date1: Date, date2: Date) => {
		return DateHelper.isDifferentDay(date1, date2);
	};

	protected fetchMessageBubbleCssClass(
		messages: Message[],
		index: number,
		currentUserId: string
	): string {
		const classes = [];

		if (
			index === 0 ||
			messages[index - 1].senderId !== messages[index].senderId
		) {
			classes.push('ch-first-group-message');
		}

		if (
			index === messages.length - 1 ||
			messages[index + 1].senderId !== messages[index].senderId
		) {
			classes.push('ch-last-group-message');
		}

		if (messages[index].senderId === currentUserId) {
			classes.push('ch-message-user');
		}

		return classes.join(' ');
	}
}
