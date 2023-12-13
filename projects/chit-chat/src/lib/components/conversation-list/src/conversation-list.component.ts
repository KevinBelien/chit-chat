import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { AuthUser } from 'chit-chat/src/lib/users';
import { Observable } from 'rxjs';

@Component({
	selector: 'ch-conversation-list',
	templateUrl: './conversation-list.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, UserAvatarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./conversation-list.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ConversationListComponent {
	user$: Observable<AuthUser | null>;

	constructor(private auth: AuthService) {
		this.user$ = this.auth.user.asObservable();
	}
}
