import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'chit-chat',
  template: `
    <p>
      chit-chat works!
    </p>
  `,
  styles: [
  ]
})
export class ChitChatComponent {
  constructor(private test: ChatService) {
}
}
