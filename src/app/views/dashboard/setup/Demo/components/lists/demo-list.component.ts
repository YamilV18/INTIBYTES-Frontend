import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Client } from '../../models/client';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-demo-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    <span class="text-primary">DEMOS</span>
                </h2>
                <button mat-flat-button [color]="'primary'" (click)="redirectToLaravel()">
                    <mat-icon [svgIcon]=""></mat-icon>
                    <span class="ml-2">Ir al Demo</span>
                </button>
            </div>

        </div>

    `,
})
export class ClientListComponent implements OnInit {
    laravelUrl: string = 'http://127.0.0.1:8000/dashboard';
    abcForms: any;
    @Input() demo: Client[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();

    constructor(private _matDialog: MatDialog) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public goNew(): void {
        this.eventNew.emit(true);
    }

    public goEdit(id: number): void {
        this.eventEdit.emit(id);
    }

    public goDelete(id: number): void {
        this.eventDelete.emit(id);
    }

    redirectToLaravel() {
        window.location.href = this.laravelUrl; // Redirige al sistema Laravel
    }
}
