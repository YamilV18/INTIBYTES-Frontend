import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {ChatMessage} from '../../models/chat.message';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ChatService} from "../../../../../../providers/services/setup/chat.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OauthService} from "../../../../../../providers/services";

@Component({
    selector: 'app-chat-list',
    imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
    templateUrl: './chat-list.component.html',
    standalone: true,
    styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit {
    messageInput: string="";
    userId: string="";
    messageList: any[] = []
    constructor( private chatservice: ChatService,
                 private route: ActivatedRoute,
                 private oauthService: OauthService) {

    }

    ngOnInit() {
        this.userId = this.route.snapshot.params["userId"];
        this.chatservice.joinRoom("ABC");
        this.listenerMessage()

    }

    sendMessage(){
        const chatMessage={
            message: this.messageInput,
            user: this.userId
        } as ChatMessage
        console.log(this.oauthService.userName)
        this.chatservice.sendMessage("ABC", chatMessage);
        this.messageInput="";
    }

    listenerMessage(){
        this.chatservice.getMessageSubject().subscribe((messages: any)=> {
            this.messageList = messages.map((item: any)=>({
                ...item,
                message_side: item.user === this.oauthService.userName ? 'sender': 'receiver'
            }))
        });
    }
}
