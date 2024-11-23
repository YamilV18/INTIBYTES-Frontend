import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Management } from '../../models/management';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {FormsModule} from "@angular/forms";
import {Service} from "../../../services/models/service";

@Component({
    selector: 'app-management-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    Lista de <span class="text-primary">Usuarios</span>
                </h2>
                <button mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2">Nuevo Usuario</span>
                </button>
            </div>
            <!-- Filtros -->
            <div class="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    [(ngModel)]="filters.name"
                    (input)="applyFilters()"
                    class="border p-2 rounded w-1/3"
                />
                <select [(ngModel)]="filters.role" (change)="applyFilters()" class="border p-2 rounded w-1/3">
                    <option value="">Todos los roles</option>
                    <option value="administrador">Administrador</option>
                    <option value="colaborador">Colaborador</option>
                    <option value="invitado">Invitado</option>
                </select>
                <select [(ngModel)]="filters.status" (change)="applyFilters()" class="border p-2 rounded w-1/3">
                    <option value="">Todos los estados</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            </div>
            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table class="w-full table-fixed">
                        <thead class="bg-primary-600 text-white">
                            <tr>
                                <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Nombre
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Email
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Contraseña
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Rol
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Fecha de Inicio
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Fecha de Termino
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Estado
                                </th>
                                <th class="w-2/6 table-header text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="bg-white"
                            *ngFor="let r of filteredManagement.slice(pageStart - 1, pageEnd); let i = index">
                            <tr class="hover:bg-gray-100">
                                <td class="w-1/6 p-2 text-center border-b">
                                    {{ i }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.name }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.email }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.password }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.role }}
                                </td>
                                <td class="w-2/6 p-2 text-start border-b text-sm">
                                    {{ r.starDate | date:'yyyy-MM-dd HH:mm:ss' }}
                                </td>
                                <td class="w-2/6 p-2 text-start border-b text-sm">
                                    {{ r.endDate | date:'yyyy-MM-dd HH:mm:ss' }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.status }}
                                </td>

                                <td class="w-2/6 p-2 text-center border-b text-sm">
                                    <div class="flex justify-center space-x-3">
                                        <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                            (click)="goEdit(r.id)">edit</mat-icon>

                                        <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                            (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                       <!-- <mat-icon
                                            class="text-sky-400 hover:text-sky-600 cursor-pointer"
                                            (click)="goAssign(r.id)"
                                            >swap_horiz
                                        </mat-icon>-->
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- paginación -->
                    <div
                        class="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
                    >
                        <span class="text-xs xs:text-sm text-gray-900">
                            Mostrando {{ pageStart }} a {{ pageEnd }} de {{ managements.length }} Entradas
                        </span>
                        <div class="inline-flex mt-2 xs:mt-0">
                            <button
                                class="text-sm text-primary-50 transition duration-150 hover:bg-primary-500 bg-primary-600 font-semibold py-2 px-4 rounded-l"
                                (click)="goToPage(page - 1)"
                                [disabled]="page === 1"
                            >
                                Prev
                            </button>
                            &nbsp; &nbsp;
                            <button
                                class="text-sm text-primary-50 transition duration-150 hover:bg-primary-500 bg-primary-600 font-semibold py-2 px-4 rounded-r"
                                (click)="goToPage(page + 1)"
                                [disabled]="page === totalPages"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class ManagementListComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() managements: Management[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();

    filters = { name: '', role: '', status: '' };
    filteredManagement: Management[] = [];

    page: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    pageStart: number = 1;
    pageEnd: number = 10;
    constructor(private _matDialog: MatDialog) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.calculateTotalPages();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['managements'] && changes['managements'].currentValue) {
            this.filteredManagement = [...this.managements];
            this.calculateTotalPages();
            this.updatePageData();
        }
    }
    applyFilters(): void {
        this.page = 1;
        this.filteredManagement = this.managements.filter((item) => {
            return (
                (!this.filters.name || item.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
                (!this.filters.role || item.role.toString() === this.filters.role) &&
                (!this.filters.status || item.status.toString() === this.filters.status)
            );
        });
        this.calculateTotalPages();
        this.updatePageData();
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.filteredManagement.length / this.pageSize);
    }

    // Actualizar los servicios mostrados según la página actual
    private updatePageData(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pageStart = startIndex + 1;
        this.pageEnd = endIndex < this.filteredManagement.length ? endIndex : this.filteredManagement.length;
    }

    // Cambiar de página
    public goToPage(pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.page = pageNumber;
            this.updatePageData();
        }
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
