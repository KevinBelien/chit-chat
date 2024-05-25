import {
	animate,
	state,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	inject,
} from '@angular/core';

@Component({
	selector: 'ch-tab',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss'],
	animations: [
		trigger('slideInOut', [
			state('true', style({ transform: 'translateX(0%)' })),
			state('false', style({ transform: 'translateX(+100%)' })),
			transition('false <=> true', animate(75)),
		]),
	],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class TabComponent {
	readonly changeDetectorRef: ChangeDetectorRef =
		inject(ChangeDetectorRef);

	@Input() isActive = false;

	@Input() title: string | null = null;

	@Input() icon: string | null = null;

	@Input() animationsEnabled: boolean = false;

	setActive = (value: boolean) => {
		this.isActive = value;
		this.changeDetectorRef.detectChanges();
	};

	setAnimationsEnabled = (value: boolean) => {
		this.animationsEnabled = value;
		this.changeDetectorRef.detectChanges();
	};
}
