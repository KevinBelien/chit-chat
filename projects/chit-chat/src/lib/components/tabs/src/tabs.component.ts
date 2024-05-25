import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	QueryList,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabComponent } from './tab/tab.component';

@Component({
	selector: 'ch-tabs',
	standalone: true,
	imports: [CommonModule, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class TabsComponent implements AfterViewInit, OnChanges {
	@ContentChildren(TabComponent)
	tabs: QueryList<TabComponent> | null = null;

	activeTab: TabComponent | null = null;

	@Input()
	position: 'bottom' | 'top' = 'top';

	@Input()
	fullWidth: boolean = false;

	@Input()
	selectedIndex: number = 0;

	@Input()
	animationsEnabled: boolean = false;

	@Output()
	onSelectionChanged = new EventEmitter<{
		component: TabComponent;
		currentIndex: number;
	}>();

	ngAfterViewInit() {
		if (!this.tabs) return;
		this.tabs.forEach(
			(tab) => (tab.animationsEnabled = this.animationsEnabled)
		);

		// get all active tabs
		let activeTabs = this.tabs.filter((tab) => tab.isActive);

		// if there is no active tab set, activate the first
		if (activeTabs.length === 0) {
			this.selectTabByIndex(this.selectedIndex);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!!changes['selectedIndex']) {
			if (
				changes['selectedIndex'].currentValue !==
				changes['selectedIndex'].previousValue
			) {
				this.selectTabByIndex(changes['selectedIndex'].currentValue);
			}
		}
		if (changes['animationsEnabled']) {
			this.tabs?.forEach((tab) =>
				tab.setAnimationsEnabled(
					changes['animationsEnabled'].currentValue
				)
			);
		}
	}

	selectTabByIndex = (index: number) => {
		if (!this.tabs || this.tabs.length < index) return;

		const tab = this.tabs.find((tab, i) => i === index);

		if (!tab) return;

		this.selectTab(tab, index);
	};

	selectTab = (tab: TabComponent, index: number) => {
		if (!this.tabs || tab === this.activeTab) return;

		if (this.activeTab) {
			this.activeTab.setActive(false);
		}

		this.activeTab = tab;
		tab.setActive(true);

		this.onSelectionChanged.emit({
			component: tab,
			currentIndex: index,
		});
	};
}
