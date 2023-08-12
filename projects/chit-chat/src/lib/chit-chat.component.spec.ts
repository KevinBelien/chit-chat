import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitChatComponent } from './chit-chat.component';

describe('ChitChatComponent', () => {
  let component: ChitChatComponent;
  let fixture: ComponentFixture<ChitChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChitChatComponent]
    });
    fixture = TestBed.createComponent(ChitChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
