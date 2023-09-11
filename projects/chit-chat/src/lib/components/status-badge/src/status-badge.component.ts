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
import { UserStatus } from 'chit-chat/src/lib/users';
import { BadgeStyle } from './interfaces/badge-style.interface';

@Component({
	selector: 'ch-status-badge',
	standalone: true,
	imports: [CommonModule, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	templateUrl: './status-badge.component.html',
	styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent implements OnChanges {
	@Input({ required: true })
	status!: UserStatus;

	@Input()
	size: number = 21;

	badgeStyle: BadgeStyle = {
		backgroundColor: 'transparent',
		icon: 'ellipse',
	};

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['status']) {
			this.badgeStyle = this.calcBadgeStyle(
				changes['status'].currentValue
			);
		}
	}

	calcBadgeStyle = (status: UserStatus): BadgeStyle => {
		switch (status) {
			case 'available':
				return {
					backgroundColor: '#23a55a',
					icon: 'ellipse',
				};
			case 'do-not-disturb':
				return {
					backgroundColor: '#fb3640',
					icon: 'remove-circle',
				};
			case 'away':
				return { backgroundColor: '#dea704', icon: 'time' };
			case 'offline':
				return { backgroundColor: '#80848e', icon: 'close-circle' };
			case 'show-offline':
				return {
					backgroundColor: '#80848e',
					icon: 'close-circle',
				};

			default:
				return { backgroundColor: 'transparent', icon: 'ellipse' };
		}
	};
}
