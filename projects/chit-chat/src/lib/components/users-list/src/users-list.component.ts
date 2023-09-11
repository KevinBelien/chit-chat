import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { FullUser, User, UserService } from 'chit-chat/src/lib/users';
import { MapResultCollection } from 'chit-chat/src/lib/utils';
import { Observable, map, switchMap } from 'rxjs';

@Component({
	selector: 'ch-users-list',
	standalone: true,
	imports: [CommonModule, IonicModule, UserAvatarComponent],
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
	users$?: Observable<User[]>;
	currentUser$: Observable<FullUser | null>;

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {
		this.currentUser$ = this.authService.user.asObservable();

		this.users$ = this.currentUser$.pipe(
			switchMap((currentUser: FullUser | null) => {
				return this.userService.getUsers().pipe(
					map((users: MapResultCollection<User>) => users.data),
					map((users: Array<User>) =>
						users.filter(
							(user) =>
								!currentUser || user.uid !== currentUser.userInfo.uid
						)
					)
				);
			})
		);
	}

	ngOnInit(): void {}

	trackUser = (index: number, user: User) => {
		return user.uid;
	};
}
