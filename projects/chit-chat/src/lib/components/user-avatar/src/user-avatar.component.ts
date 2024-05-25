import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StatusBadgeComponent } from 'chit-chat/src/lib/components/status-badge';
import { UserStatus } from 'chit-chat/src/lib/users';
import { ColorHelper } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-user-avatar',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		StatusBadgeComponent,
		NgOptimizedImage,
	],
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class UserAvatarComponent implements OnChanges {
	@Input()
	dimensions: number = 40;

	@Input()
	hoverEnabled: boolean = false;

	@Input()
	src: string | null = null;

	@Input()
	alt: string | null = '';

	@Input()
	displayName: string | null = null;

	@Input()
	userColor: string | null = null;

	initialTextColor: string | null = null;

	@Input({ required: true })
	onlineStatus!: UserStatus;

	initials: string | null = null;

	@Output()
	onClick = new EventEmitter<Event>();

	ngOnChanges(changes: SimpleChanges): void {
		if (!!changes['displayName']) {
			const displayName = changes['displayName'].currentValue;
			this.initials = !!displayName
				? this.calcInitials(displayName)
				: null;
		}

		if (changes['userColor']) {
			if (!changes['userColor'].currentValue) {
				this.initialTextColor = null;
				return;
			}

			this.initialTextColor = ColorHelper.isColorLight(
				changes['userColor'].currentValue
			)
				? '#21252a'
				: '#fff';
		}
	}

	calcInitials = (displayName: string): string | null => {
		const matches = displayName.match(/\b(\w)/g);
		const initials =
			!!matches && matches.length > 1
				? [matches[0], matches[matches.length - 1]]
				: matches;
		return !!initials ? initials.join('') : displayName;
	};

	protected handleClick = (e: Event) => {
		this.onClick.emit(e);
	};
}
