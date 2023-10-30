import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DtoUser } from 'chit-chat';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { FullUser, User, UserService } from 'chit-chat/src/lib/users';
import { MapResultCollection } from 'chit-chat/src/lib/utils';
import {
	BehaviorSubject,
	Observable,
	combineLatest,
	map,
} from 'rxjs';
import { SearchbarOptions } from '../interfaces';

@Component({
	selector: 'ch-users-list',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		UserAvatarComponent,
		ScrollingModule,
	],
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
	@ViewChild(CdkVirtualScrollViewport)
	viewport?: CdkVirtualScrollViewport;

	@Input()
	searchbarOptions: SearchbarOptions;

	users$?: Observable<User[]>;

	currentUser$: Observable<FullUser | null>;

	private searchValue: BehaviorSubject<string> =
		new BehaviorSubject<string>('');

	@Output()
	onUserClick = new EventEmitter<User>();

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {
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

	ngOnInit(): void {}

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
