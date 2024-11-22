import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Subscription } from '../../models/subscription';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-subscriptions-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    Lista de <span class="text-primary">Historial de Compras</span>
                </h2>
                <button mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2">Nuevo Historial</span>
                </button>
            </div>
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 overflow-auto">
                    <table class="w-full table-fixed border-collapse">
                        <thead class="bg-blue-600 text-white">
                        <tr>
                            <th class="w-1/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">#</th>
                            <th class="w-3/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">
                                Fecha de Vencimiento
                            </th>
                            <th class="w-3/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">
                                Fecha de Emisión
                            </th>
                            <th class="w-2/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">Estado</th>
                            <th class="w-3/12 py-3 px-4 text-center text-sm font-semibold uppercase">Acciones</th>
                        </tr>
                        </thead>
                        <tbody *ngFor="let r of subscriptions; let i = index" class="bg-gray-50">
                        <tr class="hover:bg-gray-100">
                            <td class="py-2 px-4 text-center border-b text-gray-700">{{ i + 1 }}</td>
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.enddate }}
                            </td>
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.stardate }}
                            </td>
                            <td class="py-2 px-4 text-center border-b text-sm">
                        <span
                            class="px-2 py-1 rounded-full text-xs font-medium"
                            [ngClass]="{
                                'bg-green-100 text-green-700': r.status === 'activo',
                                'bg-red-100 text-red-700': r.status === 'inactivo'
                            }"
                        >
                            {{ r.status }}
                        </span>
                            </td>
                            <td class="py-2 px-4 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        class="text-blue-500 hover:text-blue-600 cursor-pointer"
                                        (click)="goEdit(r.id)"
                                    >edit</mat-icon
                                    >
                                    <mat-icon
                                        class="text-red-500 hover:text-red-600 cursor-pointer"
                                        (click)="goDelete(r.id)"
                                    >delete_sweep</mat-icon
                                    >
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

    `,
})
export class SubscriptionListComponent implements OnInit {
    abcForms: any;
    @Input() subscriptions: Subscription[] = [];
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

    public goAssign(id: number): void {
        this.eventAssign.emit(id);
    }
}
