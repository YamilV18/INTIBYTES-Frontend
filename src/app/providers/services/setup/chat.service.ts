import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import {BehaviorSubject} from 'rxjs';
import {ChatMessage} from "../../../views/dashboard/setup/chat/models/chat.message";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private stompClient: any
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

    constructor() {
        this.initConnectionSocket()
    }
    initConnectionSocket(){
        const url = '//localhost:3000/chat-socket';
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
    }

    joinRoom(roomId: string){
        this.stompClient.connect({}, ()=>{
            this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
                const messageContent = JSON.parse(messages.body);
                const currentMessage = this.messageSubject.getValue();
                console.log(messageContent);
                currentMessage.push(messageContent);
                this.messageSubject.next(currentMessage);
            });
        });
    }
    sendMessage(roomId: string, chatMessage: ChatMessage){
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    }

    getMessageSubject(){
        return this.messageSubject.asObservable();
    }
}
