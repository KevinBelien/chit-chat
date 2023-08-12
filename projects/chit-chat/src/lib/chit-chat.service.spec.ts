import { TestBed } from '@angular/core/testing';

import { ChitChatService } from './chit-chat.service';

describe('ChitChatService', () => {
  let service: ChitChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChitChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
