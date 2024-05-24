import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserStatus } from 'chit-chat/src/lib/users';
import { BadgeConfig } from './interfaces';

@Component({
	selector: 'ch-status-badge',
	standalone: true,
	imports: [CommonModule, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './status-badge.component.html',
	styleUrls: ['./status-badge.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class StatusBadgeComponent implements OnChanges {
	@Input({ required: true })
	status!: UserStatus;

	@Input()
	size: number = 20;

	badgeConfig: BadgeConfig = {
		class: '',
		icon: 'ellipse',
	};

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['status']) {
			this.badgeConfig = this.getBadgeConfig(
				changes['status'].currentValue
			);
		}
	}

	private getBadgeConfig = (status: UserStatus): BadgeConfig => {
		switch (status) {
			case 'available':
				return {
					class: 'badge-available',
					icon: 'ellipse',
				};
			case 'do-not-disturb':
				return {
					class: 'badge-do-not-disturb',
					icon: 'remove-circle',
				};
			case 'away':
				return { class: 'badge-away', icon: 'time' };
			case 'offline':
				return { class: 'badge-offline', icon: 'close-circle' };
			case 'show-offline':
				return {
					class: 'badge-show-offline',
					icon: 'close-circle',
				};

			default:
				return { class: '', icon: 'ellipse' };
		}
	};
}
