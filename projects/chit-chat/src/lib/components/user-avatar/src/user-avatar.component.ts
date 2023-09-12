import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
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
				? this.colorShade(changes['userColor'].currentValue, -130)
				: this.colorShade(changes['userColor'].currentValue, 130);

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

	private colorShade = (colorCode: string, amount: number) => {
		let usePound = false;

		if (colorCode[0] == '#') {
			colorCode = colorCode.slice(1);
			usePound = true;
		}
		const num = parseInt(colorCode, 16);
		let red = (num >> 16) + amount;

		if (red > 255) {
			red = 255;
		} else if (red < 0) {
			red = 0;
		}

		let blue = ((num >> 8) & 0x00ff) + amount;

		if (blue > 255) {
			blue = 255;
		} else if (blue < 0) {
			blue = 0;
		}

		let green = (num & 0x0000ff) + amount;

		if (green > 255) {
			green = 255;
		} else if (green < 0) {
			green = 0;
		}
		let color = (green | (blue << 8) | (red << 16)).toString(16);
		while (color.length < 6) {
			color = 0 + color;
		}
		return (usePound ? '#' : '') + color;
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

		if (hsp > 127.5) {
			return true;
		} else {
			return false;
		}
	}
}
