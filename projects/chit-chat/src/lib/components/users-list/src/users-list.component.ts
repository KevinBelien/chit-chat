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
	map,
	mergeMap,
	scan,
	tap,
} from 'rxjs';

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
	batchSize: number = 40;

	users$?: Observable<User[]>;
	currentUser$: Observable<FullUser | null>;
	private reachedEnd: boolean = false;
	private offset: BehaviorSubject<string | null> =
		new BehaviorSubject<string | null>(null);

	@Output()
	onUserClick = new EventEmitter<User>();

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {
		this.currentUser$ = this.authService.user.asObservable();

		const batch = this.offset.pipe(
			mergeMap((lastSeen) =>
				this.userService.getUsersBatch(lastSeen, this.batchSize, true)
			),
			tap((result) => {
				this.reachedEnd = !this.reachedEnd
					? Object.keys(result).length === 0
					: this.reachedEnd;
			}),
			scan((acc, batch) => {
				return { ...acc, ...batch };
			}, {}),
			map<Record<string, any>, DtoUser[]>((batch) =>
				Object.values(batch)
			),
			map((mappedBatch) => User.fromCollection(mappedBatch)),
			map((users: MapResultCollection<User>) => users.data)
		);

		this.users$ = this.currentUser$.pipe(
			mergeMap((currentUser: FullUser | null) => {
				return batch.pipe(
					map((users: Array<User>) =>
						users.filter(
							(user) =>
								!currentUser || user.uid !== currentUser.userInfo.uid
						)
					)
				);
			})
		);
		// map((users) =>
		// 	users.filter((user) => user.uidthis.authService.getuser())
		// )
		// this.users$ = this.currentUser$.pipe(
		// 	switchMap((currentUser: FullUser | null) => {
		// 		return this.userService.getUsers().pipe(
		// 			map((users: MapResultCollection<User>) => users.data),
		// 			map((users: Array<User>) =>
		// 				users.filter(
		// 					(user) =>
		// 						!currentUser || user.uid !== currentUser.userInfo.uid
		// 				)
		// 			)
		// 		);
		// 	})
		// );
	}

	ngOnInit(): void {}

	trackUser = (index: number, user: User) => {
		return user.uid;
	};

	handleUserClick = (user: User) => {
		this.onUserClick.emit(user);
	};

	getNextBatch = (e: any, lastSeen: string) => {
		if (this.reachedEnd) return;

		const end = this.viewport?.getRenderedRange().end;
		const total = this.viewport?.getDataLength();

		if (end === total) this.offset.next(lastSeen);
	};
}
