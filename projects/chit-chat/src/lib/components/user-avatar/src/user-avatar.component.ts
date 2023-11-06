import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
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
	dimensions: number = 50;

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

	constructor(private cd: ChangeDetectorRef) {}

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

			this.initialTextColor = this.isColorLight(
				changes['userColor'].currentValue
			)
				? '#31363b'
				: '#fff';

			this.cd.detectChanges();
		}
	}

	private calcInitials = (displayName: string): string | null => {
		const matches = displayName.match(/\b(\w)/g);
		const initials =
			!!matches && matches.length > 1
				? [matches[0], matches[matches.length - 1]]
				: matches;
		return !!initials ? initials.join('') : displayName;
	};

	handleClick = (e: Event) => {
		this.onClick.emit(e);
	};

	private isColorLight(color: any) {
		var red: number, green: number, blue: number, hsp: number;

		if (color.match(/^rgb/)) {
			color = color.match(
				/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
			);

			red = color[1];
			green = color[2];
			blue = color[3];
		} else {
			color = +(
				'0x' +
				color.slice(1).replace(color.length < 5 && /./g, '$&$&')
			);

			red = color >> 16;
			green = (color >> 8) & 255;
			blue = color & 255;
		}

		hsp = Math.sqrt(
			0.299 * (red * red) +
				0.587 * (green * green) +
				0.114 * (blue * blue)
		);

		return hsp > 150;
	}
}
