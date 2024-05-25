import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DtoUser } from 'chit-chat';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { AuthUser, User, UserService } from 'chit-chat/src/lib/users';
import { ScreenService } from 'chit-chat/src/lib/utils';
import {
	BehaviorSubject,
	Observable,
	combineLatest,
	map,
	of,
	startWith,
	switchMap,
} from 'rxjs';
import { SearchbarOptions } from './../interfaces/searchbar-options.interface';

@Component({
	selector: 'ch-users-list',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		UserAvatarComponent,
		ScrollingModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
	animations: [
		trigger('openCloseSearchBar', [
			state('show', style({ height: '50px' })),
			state('hide', style({ height: '0px' })),
			transition('show => hide', animate('150ms ease-out')),
			transition('hide => show', animate('150ms ease-in')),
		]),
	],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class UsersListComponent implements OnChanges {
	readonly userService: UserService = inject(UserService);
	readonly authService: AuthService = inject(AuthService);
	readonly screenService: ScreenService = inject(ScreenService);
	readonly changeDetectorRef: ChangeDetectorRef =
		inject(ChangeDetectorRef);

	@ViewChild(CdkVirtualScrollViewport)
	viewport?: CdkVirtualScrollViewport;

	@Input() searchbarOptions: SearchbarOptions = { debounce: 350 };

	@Input() selectedUserId: string | null = null;

	@Output() onUserClick = new EventEmitter<User>();

	itemSize: number = 55;
	buffers: { minBufferPx: number; maxBufferPx: number };

	isSearchbarVisible: boolean = true;

	viewportTopItemIndex?: number;

	isMobile: boolean = this.screenService.isMobile();

	private searchValue$: BehaviorSubject<string> =
		new BehaviorSubject<string>('');

	currentUser$: Observable<AuthUser | null> = this.authService.user$;

	users$?: Observable<User[]> = this.currentUser$.pipe(
		switchMap((currentUser: AuthUser | null) => {
			const allUsers$: Observable<User[]> = currentUser
				? (this.userService.getUsers() as Observable<User[]>)
				: of([]);

			return combineLatest([
				allUsers$.pipe(startWith([])),
				this.searchValue$,
				this.currentUser$.pipe(startWith(null)),
			]).pipe(
				map(([users, filterValue, currentUser]) => {
					return users.filter((user: DtoUser) =>
						this.filterUser(user, currentUser, filterValue)
					);
				})
			);
		})
	);

	constructor() {
		this.buffers = this.calcBuffer();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['searchbarOptions']) {
			this.isSearchbarVisible =
				!('visible' in this.searchbarOptions) ||
				!!this.searchbarOptions.visible;
		}
	}

	// groupUsers = (users: Array<User>, groupExpr: keyof User) => {
	// 	return users.reduce((acc: any, cur: any) => {
	// 		const firstLetter = cur[groupExpr][0].toLowerCase();
	// 		return {
	// 			...acc,
	// 			[firstLetter]: [...(acc[firstLetter] || []), cur],
	// 		};
	// 	}, {});
	// };

	//CALCULATE BUFFER SIZE REGARDING SCREEN HEIGHT AND LIST ITEM SIZE
	private calcBuffer = () => {
		const searchbarHeight = this.isSearchbarVisible ? 60 : 0;
		return {
			minBufferPx: window.innerHeight - searchbarHeight,
			maxBufferPx: window.innerHeight + this.itemSize,
		};
	};

	private filterUser(
		user: DtoUser,
		currentUser: AuthUser | null,
		filterValue: string
	): boolean {
		const matchesSearch =
			!filterValue ||
			filterValue.trim().length === 0 ||
			user.name
				.trim()
				.toLowerCase()
				.includes(filterValue.trim().toLowerCase());

		const notCurrentUser =
			!currentUser || user.uid !== currentUser.userInfo.uid;

		return matchesSearch && notCurrentUser;
	}

	protected handleScroll = (topItemIndex: number) => {
		if (this.viewportTopItemIndex === topItemIndex) return;

		const searchValue = this.searchValue$.getValue();
		const scrolledUp: boolean =
			!this.viewportTopItemIndex ||
			topItemIndex < this.viewportTopItemIndex;

		const bottomScrollOffset =
			this.viewport?.measureScrollOffset('bottom');

		//DO NOT HIDE/SHOW SEARCHBAR WHEN ALREADY SCROLLED TO LAST ITEM
		if (!!bottomScrollOffset && bottomScrollOffset < this.itemSize) {
			this.viewportTopItemIndex = topItemIndex;
			return;
		}

		if (scrolledUp && this.searchbarOptions.hideOnScroll) {
			this.isSearchbarVisible = true;
		} else if (
			this.searchbarOptions.hideOnScroll &&
			searchValue.trim().length === 0
		) {
			this.isSearchbarVisible = false;
		}

		this.viewportTopItemIndex = topItemIndex;
	};

	protected trackUser = (index: number, user: User) => {
		return user.uid;
	};

	protected handleUserClick = (user: User) => {
		this.onUserClick.emit(user);
	};

	searchUsers = (e: Event) => {
		this.searchValue$.next((e.target as HTMLInputElement).value);
	};

	resetSelection = () => {
		this.selectedUserId = null;
		this.changeDetectorRef.detectChanges();
	};
}
