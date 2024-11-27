import { Client } from '../models/client';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {ClientService} from "../../../../../providers/services/setup/client.service";

@Component({
    selector: 'app-demo-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-demo-list
            class="w-full"
            [demo]="demo"
        ></app-demo-list>
    `,
})
export class DemoContainerComponent implements OnInit {
    public error: string = '';
    public demo: Client[] = [];
    public client = new Client();

    constructor(
        private _clientService: ClientService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._clientService.getAll$().subscribe(
            (response) => {
                this.demo = response;
            },
            (error) => {
                this.error = error;
            }
        );

    }
}
