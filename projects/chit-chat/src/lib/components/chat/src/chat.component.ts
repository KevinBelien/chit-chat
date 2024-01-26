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
} from 'rxjs';

import {
	AutoSizeVirtualScrollStrategy,
	RxVirtualFor,
	RxVirtualScrollViewportComponent,
} from '@rx-angular/template/experimental/virtual-scrolling';

import { AuthUser } from 'chit-chat/src/lib/users';

@Component({
	selector: 'ch-chat',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		RxVirtualFor,
		RxVirtualScrollViewportComponent,
		AutoSizeVirtualScrollStrategy,
	],
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
	@ViewChild(RxVirtualScrollViewportComponent, { static: false })
	viewport?: RxVirtualScrollViewportComponent;

	@Input()
	scrollTreshold: number = 4000;

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
			// setTimeout(() => {
			// 	if (this.firstFetch && messages.length > 0) {
			// 		this.viewport?.scrollToIndex(this.initialBatchSize);
			// 	}
			// }, 100);
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
				console.log('messages', messages);

				if (this.firstFetch && messages.length > 0)
					setTimeout(() => {
						this.viewport?.scrollToIndex(this.initialBatchSize);
						setTimeout(() => (this.firstFetch = false), 300);
					}, 200);
			})
		);
	};

	trackMessage = (index: number, message: Message) => {
		return message.id;
	};

	onScroll = (lastMessageIndex: number, lastMessage: Message) => {
		if (this.firstFetch) return;

		const distanceFromTop = this.viewport?.getScrollTop();

		// console.log(distanceFromTop);
		if (!distanceFromTop) return;
		console.log(distanceFromTop);

		if (
			distanceFromTop < this.scrollTreshold &&
			!this.isLoading &&
			!this.lastMessageFetched
		) {
			this.lastMessage$.next(lastMessage);
		}
		// const distanceScrolled =
		// 	(viewportSize - (this.lastViewportSize || 0)) * 200 +
		// 	distanceFromTop;
		// // Calculate the speed of scrolling based on the change in scroll offset
		// const scrollSpeed = (this.lastScrollTop || 0) - distanceScrolled;
		// // Update the last scroll offset for the next calculation
		// this.lastScrollTop = distanceFromTop;
		// this.lastViewportSize = viewportSize;
		// // Calculate the threshold based on the visible item count and scroll speed
		// const dynamicThreshold =
		// 	this.calculateDynamicThreshold(scrollSpeed);
		// if (
		// 	scrollSpeed > 0 &&
		// 	distanceScrolled < dynamicThreshold &&
		// 	!this.isLoading &&
		// 	!this.lastMessageFetched
		// ) {
		// 	this.lastMessage$.next(lastMessage);
		// }
	};

	calculateDynamicThreshold(scrollSpeed: number): number {
		// console.log(scrollSpeed);
		const baseThreshold = this.scrollTreshold;
		const speedMultiplier = 5;
		// Weight for the weighted average
		const weight = 0.1; // Adjust based on testing

		// Calculate the dynamic threshold based on scroll speed
		const dynamicThreshold =
			baseThreshold + scrollSpeed * speedMultiplier;

		// Use a weighted average to smooth out the changes
		const smoothedThreshold =
			(1 - weight) * baseThreshold + weight * dynamicThreshold;

		return Math.max(smoothedThreshold, 0);
	}

	// scrollToBottom() {
	// 	if (!!this.viewport) {
	// 		this.viewport.scrollTo(40);
	// 	}
	// }
}
