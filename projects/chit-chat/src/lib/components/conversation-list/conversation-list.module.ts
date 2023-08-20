import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConversationListComponent } from './src/conversation-list.component';

@NgModule({
	declarations: [ConversationListComponent],
	imports: [CommonModule],
	exports: [ConversationListComponent],
})
export class ConversationListModule {}
