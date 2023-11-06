import { CommonModule } from '@angular/common';
import {
	AfterContentInit,
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
import { TabComponent } from '../tab/tab.component';

@Component({
	selector: 'ch-tabs',
	standalone: true,
	imports: [CommonModule, IonicModule],
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit, OnChanges {
	@ContentChildren(TabComponent)
	tabs: QueryList<TabComponent> | null = null;

	activeTab: TabComponent | null = null;

	@Input()
	position: 'bottom' | 'top' = 'top';

	@Input()
	fullWidth: boolean = false;

	@Input()
	selectedIndex: number = 0;

	@Output()
	onSelectionChanged = new EventEmitter<{
		component: TabComponent | null;
		currentIndex: number;
	}>();

	constructor() {}

	// contentChildren are set
	ngAfterContentInit() {
		if (!this.tabs) return;
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
	}

	selectTabByIndex = (index: number) => {
		if (!this.tabs || this.tabs.length < index) return;
		if (this.activeTab) {
			this.activeTab.isActive = false;
		}
		const tab = this.tabs.find((tab, i) => i === index);

		if (!tab) return;

		this.selectTab(tab, index);
	};

	selectTab = (tab: TabComponent, index: number) => {
		if (!this.tabs) return;

		if (this.activeTab) {
			this.activeTab.isActive = false;
		}

		this.activeTab = tab;

		tab.isActive = true;

		this.onSelectionChanged.emit({
			component: tab,
			currentIndex: index,
		});
	};
}
