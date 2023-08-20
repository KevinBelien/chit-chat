import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'ch-user-avatar',
	standalone: true,
	imports: [CommonModule, IonicModule],
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class UserAvatarComponent {
	@Input()
	content?: string;

	@Input()
	height: number = 40;

	@Input()
	src: string | null = null;

	@Input()
	alt: string | null = '';

	@Input()
	initials: string | null = null;

	constructor() {}
}
