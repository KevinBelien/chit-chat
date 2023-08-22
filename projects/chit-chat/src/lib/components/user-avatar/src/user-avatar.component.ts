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
	dimensions: number = 40;

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

			// const color = tinycolor(changes['userColor'].currentValue);
			// console.log(color);

			this.initialTextColor = this.isColorLight(
				changes['userColor'].currentValue
			)
				? this.colorShade(changes['userColor'].currentValue, -130)
				: this.colorShade(changes['userColor'].currentValue, 130);

			console.log(this.initialTextColor);
			this.cd.detectChanges();
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

	colorShade = (colorCode: string, amount: number) => {
		let usePound = false;

		if (colorCode[0] == '#') {
			colorCode = colorCode.slice(1);
			usePound = true;
		}
		const num = parseInt(colorCode, 16);
		let r = (num >> 16) + amount;

		if (r > 255) {
			r = 255;
		} else if (r < 0) {
			r = 0;
		}

		let b = ((num >> 8) & 0x00ff) + amount;

		if (b > 255) {
			b = 255;
		} else if (b < 0) {
			b = 0;
		}

		let g = (num & 0x0000ff) + amount;

		if (g > 255) {
			g = 255;
		} else if (g < 0) {
			g = 0;
		}
		let color = (g | (b << 8) | (r << 16)).toString(16);
		while (color.length < 6) {
			color = 0 + color;
		}
		return (usePound ? '#' : '') + color;
	};

	// lightenColor = (hexColor: string, magnitude: number) => {
	// 	hexColor = hexColor.replace(`#`, ``);
	// 	if (hexColor.length === 6) {
	// 		const decimalColor = parseInt(hexColor, 16);
	// 		let r = (decimalColor >> 16) + magnitude;
	// 		r > 255 && (r = 255);
	// 		r < 0 && (r = 0);
	// 		let g = (decimalColor & 0x0000ff) + magnitude;
	// 		g > 255 && (g = 255);
	// 		g < 0 && (g = 0);
	// 		let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
	// 		b > 255 && (b = 255);
	// 		b < 0 && (b = 0);
	// 		return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
	// 	} else {
	// 		return hexColor;
	// 	}
	// };

	isColorLight(color: any) {
		// Variables for red, green, blue values
		var r: number, g: number, b: number, hsp: number;

		// Check the format of the color, HEX or RGB?
		if (color.match(/^rgb/)) {
			// If RGB --> store the red, green, blue values in separate variables
			color = color.match(
				/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
			);

			r = color[1];
			g = color[2];
			b = color[3];
		} else {
			// If hex --> Convert it to RGB: http://gist.github.com/983661
			color = +(
				'0x' +
				color.slice(1).replace(color.length < 5 && /./g, '$&$&')
			);

			r = color >> 16;
			g = (color >> 8) & 255;
			b = color & 255;
		}

		// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
		hsp = Math.sqrt(
			0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
		);

		// Using the HSP value, determine whether the color is light or dark
		if (hsp > 127.5) {
			return true;
		} else {
			return false;
		}
	}
}
