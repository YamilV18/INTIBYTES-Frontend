import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientService} from "../../../../../providers/services/setup/client.service";
import {ChatListComponent} from "../components";
import {ChatMessage} from "../models/chat.message";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ChatListComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-chat-list
            class="w-full"
        ></app-chat-list>
    `,
})
export class ChatContainerComponent implements OnInit {
    public error: string = '';
    public clients: ChatMessage[] = [];
    public client = new ChatMessage();

    constructor(
        private _clientService: ClientService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
    }


}
