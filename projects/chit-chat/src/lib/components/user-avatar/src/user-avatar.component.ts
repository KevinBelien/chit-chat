import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	ViewEncapsulation,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StatusBadgeComponent } from 'chit-chat/src/lib/components/status-badge';
import { UserStatus } from 'chit-chat/src/lib/users';

@Component({
	selector: 'ch-user-avatar',
	standalone: true,
	imports: [CommonModule, IonicModule, StatusBadgeComponent],
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class UserAvatarComponent implements OnChanges {
	@Input()
	dimensions: number = 40;

	@Input()
	src: string | null = null;

	@Input()
	alt: string | null = '';

	@Input()
	displayName: string | null = null;

	@Input({ required: true })
	onlineStatus!: UserStatus;

	initials: string | null = null;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (!!changes['displayName']) {
			const displayName = changes['displayName'].currentValue;
			this.initials = !!displayName
				? this.calcInitials(displayName)
				: null;
		}
	}

	calcInitials = (displayName: string): string | null => {
		const matches = displayName.match(/\b(\w)/g);
		return !!matches ? matches.join('') : displayName;
	};
}
