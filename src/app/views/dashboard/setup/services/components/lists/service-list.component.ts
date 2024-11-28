import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Service } from '../../models/service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {CategoryService} from "../../../../../../providers/services/setup/category.service";
import {FormsModule} from "@angular/forms";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'; // Tipo de archivo Excel

@Component({
    selector: 'app-service-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    Lista de <span class="text-primary">Servicio</span>
                </h2>
                <button mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2">Nuevo Servicio</span>
                </button>
                <button mat-raised-button color="primary" (click)="generatePDF()">Generar PDF</button>
                <button mat-raised-button color="primary" (click)="exportToExcel()">Exportar a Excel</button>
            </div>
            <!-- Filtros -->
            <div class="bg-gray-100 rounded p-2 mb-2">
                <div class="sm:flex sm:space-x-4">
                    <!-- Filtro de NOMBRE -->
                    <div class="flex-1">
                        <div class="px-4 sm:px-6 py-2">
                            <div class="font-semibold text-lg mb-2">
                                Filtro de Nombre
                            </div>
                            <div class="mb-2">
                                <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                    id="name"
                                    type="text"
                                    [(ngModel)]="filterName"
                                    (input)="applyFilters()"
                                    placeholder="Ingrese el nombre"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Filtro de CATEGORÍA -->
                    <div class="flex-1">
                        <div class="px-4 sm:px-6 py-2">
                            <div class="font-semibold text-lg mb-1">
                                Filtro de Categoría
                            </div>
                            <div class="mb-2">
                                <select
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                    id="category"
                                    [(ngModel)]="filterCategory"
                                    (change)="applyFilters()"
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>
                                    <option
                                        *ngFor="let category of categories"
                                        [value]="category.id"
                                    >
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table class="w-full table-fixed">
                        <thead class="bg-primary-600 text-white">
                            <tr>
                                <th class="w-1/12 table-head text-center px-5 border-r">#</th>
                                <th class="w-1/6 table-header text-center px-5 border-r">
                                    Nombre
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Descripción
                                </th>
                                <th class="w-1/12 table-header text-center border-r">
                                    Precio
                                </th>
                                <th class="w-1/6 table-header text-center border-r">
                                    Categoría
                                </th>
                                <th class="w-1/6 table-header text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="bg-white"
                            *ngFor="let r of filteredServices.slice(pageStart - 1, pageEnd); let i = index">
                            <tr class="hover:bg-gray-100">
                                <td class="w-1/6 p-2 text-center border-b">
                                    {{ i + pageStart }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.name }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.description }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.price }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.category.name }}
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
                            Mostrando {{ pageStart }} a {{ pageEnd }} de {{ service.length }} Entradas
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
export class ServiceListComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() service: Service[] = [];
    @Input() categories: any[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();

    //filtro
    filterName: string = '';
    filterCategory: string = '';
    filteredServices: Service[] = [];

    //paginación
    page: number = 1; // Página actual
    pageSize: number = 10; // Cantidad de servicios por página
    totalPages: number = 1; // Total de páginas
    pageStart: number = 1; // Primer servicio en la página
    pageEnd: number = 10; // Último servicio en la página

    constructor(private _matDialog: MatDialog, private categoryService: CategoryService) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.loadCategories();
        this.calculateTotalPages();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['service'] && changes['service'].currentValue) {
            this.filteredServices = [...this.service];
            this.calculateTotalPages();
            this.updatePageData();
        }
    }
    private loadCategories(): void {
        this.categoryService.getCategories().subscribe(
            (data) => {
                this.categories = data;
            },
            (error) => {
                console.error('Error al cargar categorías:', error);
            }
        );
    }
    public applyFilters(): void {
        this.page = 1;
        this.filteredServices = this.service.filter((service) => {
            const matchesName = service.name.toLowerCase().includes(this.filterName.toLowerCase());
            const matchesCategory = this.filterCategory ? service.category.id === +this.filterCategory : true;
            return matchesName && matchesCategory;
        });
        this.calculateTotalPages();
        this.updatePageData();
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.filteredServices.length / this.pageSize);
    }

    // Actualizar los servicios mostrados según la página actual
    private updatePageData(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pageStart = startIndex + 1;
        this.pageEnd = endIndex < this.filteredServices.length ? endIndex : this.filteredServices.length;
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

    generatePDF(): void {
        const doc = new jsPDF(); // Crear el documento PDF

        // Título del documento
        doc.setFontSize(18);
        doc.text('Reporte de Servicios', 10, 10);

        // Agregar fecha de generación
        doc.setFontSize(12);
        doc.text('Generado el: ' + new Date().toLocaleDateString(), 10, 20);

        // Preparar los datos para la tabla
        const subscriptions = this.service.map((sub) => {
            return [
                sub.id,
                sub.name || 'N/A',
                sub.description|| 'N/A',
                sub.price|| 'N/A',
                sub.category?.name || 'N/A',
            ];
        });

        // Crear la tabla
        (doc as any).autoTable({
            head: [['ID', 'Nombre', 'Descripcion', 'Precio', 'Categoria']],
            body: subscriptions,
            startY: 30, // Posición inicial de la tabla
        });

        // Guardar el archivo
        doc.save('reporte_categoria.pdf');
    }

    exportToExcel(): void {
        // Preparar los datos para la tabla
        const data = this.service.map((sub) => ({
            ID: sub.id,
            Nombre: sub.name || 'N/A',
            Descripcion: sub.description || 'N/A',
            Precio: sub.price || 'N/A',
            Categoria: sub.category?.name || 'N/A',

        }));

        // Crear una hoja de trabajo con estilos
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: [] });

        // Ajustar ancho de columnas
        worksheet['!cols'] = [
            { wpx: 50 }, // ID
            { wpx: 200 }, // Nombre
            { wpx: 150 }, // Descripcion
            { wpx: 120 }, // Precio
            { wpx: 120 }, // Categoria
        ];

        // Crear el libro de Excel
        const workbook: XLSX.WorkBook = {
            Sheets: { 'Servicios': worksheet },
            SheetNames: ['Servicios'],
        };

        // Generar el archivo Excel con el nombre personalizado
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Guardar el archivo
        this.saveAsExcelFile(excelBuffer, 'Reporte_Servicios');
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(data, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
    }
}
