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
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthUser, DtoUser } from 'chit-chat';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { User, UserService } from 'chit-chat/src/lib/users';
import { MapResultCollection } from 'chit-chat/src/lib/utils';
import {
	BehaviorSubject,
	Observable,
	combineLatest,
	map,
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
			state('show', style({ height: '60px' })),
			state('hide', style({ height: '0px' })),
			transition('show => hide', animate('200ms ease-out')),
			transition('hide => show', animate('200ms ease-in')),
		]),
	],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class UsersListComponent implements OnInit, OnChanges {
	@ViewChild(CdkVirtualScrollViewport)
	viewport?: CdkVirtualScrollViewport;

	@Input()
	searchbarOptions: SearchbarOptions;

	users$?: Observable<User[]>;

	currentUser$: Observable<AuthUser | null>;

	private searchValue: BehaviorSubject<string> =
		new BehaviorSubject<string>('');

	itemSize: number = 65;
	buffers: { minBufferPx: number; maxBufferPx: number };

	isSearchbarVisible: boolean = true;

	@Output()
	onUserClick = new EventEmitter<User>();

	viewportTopItemIndex?: number;

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {
		this.buffers = this.calcBuffer();
		this.searchbarOptions = { debounce: 350 };
		this.currentUser$ = this.authService.user.asObservable();

		const allUsers$: Observable<MapResultCollection<DtoUser>> =
			this.userService.getUsers();

		this.users$ = combineLatest([
			allUsers$,
			this.searchValue,
			this.currentUser$,
		]).pipe(
			map(([users, filterValue, currentUser]) => {
				return users.data.filter(
					(user: DtoUser) =>
						(!currentUser || user.uid !== currentUser.userInfo.uid) &&
						(!filterValue ||
							filterValue.trim().length === 0 ||
							user.name
								.trim()
								.toLowerCase()
								.indexOf(filterValue.trim().toLowerCase()) > -1)
				);
			})
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['searchbarOptions']) {
			this.isSearchbarVisible =
				!('visible' in this.searchbarOptions) ||
				!!this.searchbarOptions.visible;
		}
	}

	//CALCULATE BUFFER SIZE REGARDING SCREEN HEIGHT AND LIST ITEM SIZE
	calcBuffer = () => {
		const searchbarHeight = this.isSearchbarVisible ? 60 : 0;
		return {
			minBufferPx: window.innerHeight - searchbarHeight,
			maxBufferPx: window.innerHeight + this.itemSize * 5,
		};
	};

	ngOnInit(): void {}

	onScroll = (topItemIndex: number) => {
		if (this.viewportTopItemIndex === topItemIndex) return;

		const searchValue = this.searchValue.getValue();
		const scrolledUp: boolean =
			!this.viewportTopItemIndex ||
			topItemIndex < this.viewportTopItemIndex;

		const bottomScrollOffset =
			this.viewport?.measureScrollOffset('bottom');

		//DO NOT HIDE/SHOW SEARCHBAR WHEN ALREADY SCROLLED TO LAST ITEM
		if (!!bottomScrollOffset && bottomScrollOffset < 65) {
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

	trackUser = (index: number, user: User) => {
		return user.uid;
	};

	handleUserClick = (user: User) => {
		this.onUserClick.emit(user);
	};

	searchUsers = (e: Event) => {
		this.searchValue.next((e.target as HTMLInputElement).value);
	};
}
