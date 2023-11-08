import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthUser } from 'chit-chat';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { Observable } from 'rxjs';

@Component({
	selector: 'ch-menu-header',
	standalone: true,
	imports: [CommonModule, IonicModule, UserAvatarComponent],
	templateUrl: './menu-header.component.html',
	styleUrls: ['./menu-header.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class MenuHeaderComponent {
	@Input()
	title?: string;

	user$: Observable<AuthUser | null>;

	constructor(private authService: AuthService) {
		this.user$ = this.authService.user.asObservable();
	}
}
