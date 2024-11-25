import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from "../../../views/dashboard/setup/chat/models/chat.message";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private stompClient: any;
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    private apiUrl = 'http://localhost:3000/chat'; // URL para obtener los mensajes desde el backend

    constructor(private http: HttpClient) {
        this.initConnectionSocket();
    }

    initConnectionSocket() {
        const url = '//localhost:3000/chat-socket';
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
    }

    joinRoom(roomId: string) {
        // Cargar los mensajes desde la base de datos cuando el usuario entra al chat
        this.http.get<ChatMessage[]>(`${this.apiUrl}/${roomId}`).subscribe(messages => {
            this.messageSubject.next(messages);
        });

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
                const messageContent = JSON.parse(messages.body);
                const currentMessage = this.messageSubject.getValue();
                currentMessage.push(messageContent);
                this.messageSubject.next(currentMessage);
            });
        });
    }

    sendMessage(roomId: string, chatMessage: ChatMessage) {
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
    }

    getMessageSubject() {
        return this.messageSubject.asObservable();
    }
}
