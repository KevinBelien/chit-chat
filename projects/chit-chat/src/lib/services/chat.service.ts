import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LibConfig, LibConfigService } from '../chit-chat.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) {
    console.log('config', config)
  }
  
  fetch = () => {
    return "hello"
  }
}
