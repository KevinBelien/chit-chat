import { CommonModule, DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { Message, MessageService } from 'chit-chat/src/lib/messages';
import { ScreenService } from 'chit-chat/src/lib/utils';

import {
	BehaviorSubject,
	EMPTY,
	Observable,
	Subject,
	combineLatest,
	map,
	scan,
	startWith,
	switchMap,
	take,
	tap,
} from 'rxjs';

import {
	AutoSizeVirtualScrollStrategy,
	ListRange,
	RxVirtualFor,
	RxVirtualScrollViewportComponent,
} from '@rx-angular/template/experimental/virtual-scrolling';

import { AuthUser } from 'chit-chat/src/lib/users';

import { MessageBubbleComponent } from 'chit-chat/src/lib/components/message-bubble';
import { ConversationContext } from 'chit-chat/src/lib/conversations';
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
export class MessageBoardComponent implements OnChanges {
	readonly messageService: MessageService = inject(MessageService);
	readonly authService: AuthService = inject(AuthService);
	readonly screenService: ScreenService = inject(ScreenService);

	@ViewChild(RxVirtualScrollViewportComponent, { static: false })
	viewport?: RxVirtualScrollViewportComponent;

	@Input()
	batchSize: number = 20;

	@Input()
	maxWidth: number = 900;

	messageBubbleDimensions: { maxWidth: number | string };

	@Input()
	conversationContext: ConversationContext | null = null;

	viewportId: string = `chat-list-viewport-${crypto.randomUUID()}`;

	scrolled$ = new Subject<number>();
	viewsRendered$ = new Subject<Message[]>();
	viewRange: ListRange = { start: 0, end: 0 };

	conversationContext$: BehaviorSubject<ConversationContext | null> =
		new BehaviorSubject<ConversationContext | null>(null);
	currentUser$: Observable<AuthUser | null> = this.authService.user$;

	messages$?: Observable<Message[]> = combineLatest([
		this.currentUser$,
		this.conversationContext$,
	]).pipe(
		switchMap(([loggedinUser, conversationContext]) => {
			this.lastMessage = null;
			this.initialScrollIsStable = false;
			this.viewRange = { start: 0, end: 0 };
			if (!loggedinUser || !conversationContext) return EMPTY;
			return this.infiniteScroll(loggedinUser, conversationContext);
		}),
		startWith([])
	);

	lastMessage: Message | null = null;

	initialScrollIsStable: boolean = false;

	scrolledIndexChangedCounter: number = 0;

	constructor() {
		this.messageBubbleDimensions =
			this.calcDimensionsOfMessageBubble();
		this.screenService.breakPointChanged.subscribe(() => {
			this.messageBubbleDimensions =
				this.calcDimensionsOfMessageBubble();
		});
	}

	private infiniteScroll = (
		loggedinUser: AuthUser,
		conversationContext: ConversationContext
	): Observable<Message[]> => {
		return this.scrolled$.pipe(
			switchMap((scrolled) =>
				this.viewsRendered$.pipe(
					map(() => scrolled),
					take(1)
				)
			),
			startWith(null),
			switchMap((scrolled) => {
				// console.log('scrolled', scrolled);
				// console.log('range', this.viewRange);
				if (
					scrolled === null ||
					(this.initialScrollIsStable && this.viewRange.start === 0)
				) {
					return this.messageService.getMessages(
						conversationContext,
						loggedinUser.userInfo.uid,
						this.lastMessage,
						this.batchSize
					) as Observable<Message[]>;
				}
				if (!this.initialScrollIsStable) {
					this.initialScrollIsStable =
						this.viewRange.end === this.batchSize;
				}
				return EMPTY;
			}),
			map((messages) => {
				return messages.reduce((acc, cur) => {
					return { ...acc, [cur.id]: cur };
				}, {});
			}),
			scan((acc: any, batch) => {
				const mergedMessages = { ...acc, ...batch };
				return mergedMessages;
			}, {}),
			map((scanResult) => Object.values(scanResult)),
			map((messages: any) => {
				return [
					...messages.sort(
						(a: Message, b: Message) =>
							a.sendAt.getTime() - b.sendAt.getTime()
					),
				];
			}),
			tap((messages) => {
				// console.log(messages);
				this.lastMessage = messages[0];
			}),
			startWith([])
		);
	};

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['conversationContext']) {
			this.conversationContext$.next(this.conversationContext);
		}
	}

	private calcDimensionsOfMessageBubble = () => {
		if (this.screenService.sizes['lg']) {
			return { maxWidth: '75%' };
		} else {
			return { maxWidth: '87%' };
		}
	};

	protected setViewRange(range: ListRange) {
		this.viewRange = range;
	}

	protected trackMessage = (index: number, message: Message) => {
		return message.id;
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
