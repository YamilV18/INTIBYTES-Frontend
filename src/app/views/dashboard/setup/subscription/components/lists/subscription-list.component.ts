import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Subscription } from '../../models/subscription';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {FormsModule} from "@angular/forms";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'; // Tipo de archivo Excel

@Component({
    selector: 'app-subscriptions-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule],
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
                <button mat-raised-button color="primary" (click)="generatePDF()">Generar PDF</button>
                <button mat-raised-button color="primary" (click)="exportToExcel()">Exportar a Excel</button>

            </div>
            <!-- Filtro de Estado -->
            <div class="bg-gray-100 rounded p-2 mb-4">
                <div class="flex">
                    <div class="flex-1">
                        <div class="px-4 sm:px-6 py-2">
                            <div class="font-semibold text-lg mb-1">Filtro de Estado</div>
                            <select
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                [(ngModel)]="filterStatus"
                                (change)="applyFilters()"
                            >
                                <option value="">Todos</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Tabla -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 overflow-auto">
                    <table class="w-full table-fixed border-collapse">
                        <thead class="bg-blue-600 text-white">
                        <tr>


                            <th class="w-1/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">#</th>
                            <th class="w-3/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">
                                Nombre del Servicio
                            </th>
                            <th class="w-3/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">
                                Fecha de Vencimiento
                            </th>
                            <th class="w-3/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">
                                Fecha de Emisión
                            </th>
                            <th class="w-2/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">Estado</th>
                            <th class="w-2/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">Nombre Usuario</th>
                            <th class="w-2/12 py-3 px-4 border-r text-center text-sm font-semibold uppercase">Rol Usuario</th>
                            <th class="w-3/12 py-3 px-4 text-center text-sm font-semibold uppercase">Acciones</th>
                        </tr>
                        </thead>
                        <tbody
                            *ngFor="let r of filteredSubscriptions.slice(pageStart - 1, pageEnd); let i = index"
                            class="bg-gray-50"
                        >
                        <tr class="hover:bg-gray-100">
                            <td class="py-2 px-4 text-center border-b text-gray-700">{{ i + pageStart }}</td>
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.service?.name || 'No especificado' }}
                            </td>

                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.endDate   | date: 'longDate'}}
                            </td>
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.starDate  | date: 'longDate' }}
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
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.user?.name || 'No especificado' }}
                            </td>
                            <td class="py-2 px-4 text-center border-b text-gray-700 text-sm">
                                {{ r.user?.role || 'No especificado' }}
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
                    <!-- Paginación -->
                    <div
                        class="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
                    >
                        <span class="text-xs xs:text-sm text-gray-900">
                            Mostrando {{ pageStart }} a {{ pageEnd }} de {{ subscriptions.length }} Entradas
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
export class SubscriptionListComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() subscriptions: Subscription[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();

    filterStatus: string = '';
    filteredSubscriptions: Subscription[] = [];

    // Paginación
    page: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    pageStart: number = 1;
    pageEnd: number = 10;

    constructor(private _matDialog: MatDialog) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.applyFilters();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['subscriptions'] && changes['subscriptions'].currentValue) {
            this.applyFilters();
            this.calculateTotalPages();
            this.updatePageData();
        }
    }

    public applyFilters(): void {
        this.page = 1;
        this.filteredSubscriptions = this.subscriptions.filter((sub) => {
            return this.filterStatus
                ? sub.status === (this.filterStatus === '1' ? 'activo' : 'inactivo')
                : true;
        });
        this.calculateTotalPages();
        this.updatePageData();
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.filteredSubscriptions.length / this.pageSize);
    }

    private updatePageData(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pageStart = startIndex + 1;
        this.pageEnd =
            endIndex < this.filteredSubscriptions.length ? endIndex : this.filteredSubscriptions.length;
    }

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

    generatePDF(): void {
        const doc = new jsPDF(); // Crear el documento PDF

        // Título del documento
        doc.setFontSize(18);
        doc.text('Reporte de Suscripciones', 10, 10);

        // Agregar fecha de generación
        doc.setFontSize(12);
        doc.text('Generado el: ' + new Date().toLocaleDateString(), 10, 20);

        // Preparar los datos para la tabla
        const subscriptions = this.subscriptions.map((sub) => {
            return [
                sub.id,
                sub.service?.name || 'N/A',
                sub.user?.name || 'N/A',
                sub.starDate ? new Date(sub.starDate).toLocaleDateString() : 'N/A', // Formatear starDate
                sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A', // Formatear endDate
                sub.service?.price || 'N/A',
            ];
        });

        // Crear la tabla
        (doc as any).autoTable({
            head: [['ID', 'Servicio', 'Usuario', 'Fecha Inicio', 'Fecha Fin', 'Precio']],
            body: subscriptions,
            startY: 30, // Posición inicial de la tabla
        });

        // Guardar el archivo
        doc.save('reporte_suscripciones.pdf');
    }

    exportToExcel(): void {
        // Preparar los datos para la tabla
        const data = this.subscriptions.map((sub) => ({
            ID: sub.id,
            Servicio: sub.service?.name || 'N/A',
            Usuario: sub.user?.name || 'N/A',
            FechaInicio: sub.starDate ? new Date(sub.starDate).toLocaleDateString() : 'N/A',
            FechaFin: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A',
            Precio: sub.service?.price || 'N/A',
            Estado: Number(sub.status) === 1 ? 'Activo' : 'Inactivo',

        }));

        // Crear una hoja de trabajo con estilos
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: [] });

        // Ajustar ancho de columnas
        worksheet['!cols'] = [
            { wpx: 50 }, // ID
            { wpx: 200 }, // Servicio
            { wpx: 150 }, // Usuario
            { wpx: 120 }, // FechaInicio
            { wpx: 120 }, // FechaFin
            { wpx: 100 }, // Precio
            { wpx: 100 }, // Estado
        ];

        // Crear el libro de Excel
        const workbook: XLSX.WorkBook = {
            Sheets: { 'Suscripciones': worksheet },
            SheetNames: ['Suscripciones'],
        };

        // Generar el archivo Excel con el nombre personalizado
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Guardar el archivo
        this.saveAsExcelFile(excelBuffer, 'Reporte_Suscripciones');
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
    }


}
