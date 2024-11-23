import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Review } from '../../models/review';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {Service} from "../../../services/models/service";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-reviews-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    Mis <span class="text-primary">Reseñas</span>
                </h2>


                <button mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2">Nueva Reseña</span>
                </button>

                <!-- henyel paso por aqui -->

            </div>
            <!-- Filtros -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    class="form-input p-2 rounded border"
                    type="text"
                    placeholder="Buscar por reseña"
                    [(ngModel)]="filters.review"
                    (ngModelChange)="applyFilters()"
                />
                <select
                    class="form-select p-2 rounded border"
                    [(ngModel)]="filters.rating"
                    (ngModelChange)="applyFilters()"
                >
                    <option value="">Filtrar por calificación</option>
                    <option *ngFor="let star of [1, 2, 3, 4, 5]" [value]="star">
                        {{ star }} Estrella(s)
                    </option>
                </select>
                <input
                    class="form-input p-2 rounded border"
                    type="date"
                    [(ngModel)]="filters.sendDate"
                    (ngModelChange)="applyFilters()"
                />
            </div>

            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div *ngFor="let r of filteredReviews.slice(pageStart - 1, pageEnd); let i = index" class="bg-white rounded-lg shadow-md p-4">
                            <div class="flex justify-between items-center">
                                <div class="text-lg font-semibold text-primary-600">Reseña #{{ i + 1 }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="flex">
                                    <span *ngFor="let star of getStars(r.rating)" class="text-yellow-500">★</span>
                                    <span *ngFor="let star of getEmptyStars(r.rating)" class="text-gray-300">☆</span>
                                </div>
                            </div>
                            <div class="mt-2">
                                <div class="text-sm text-gray-600">Reseña:</div>
                                <p class="text-sm text-gray-800">{{ r.review }}</p>
                            </div>
                            <div class="mt-2">
                                <div class="text-sm text-gray-500">Fecha de envio: {{ r.send_date }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-sm text-gray-500">Fecha de actualización: {{ r.update_date }}</div>
                            </div>
                            <div class="mt-4 flex justify-center space-x-3">
                                <!-- Los botones de acción (edit, delete, etc.) pueden ir aquí -->
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- paginación -->
            <div
                class="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
            >
                        <span class="text-xs xs:text-sm text-gray-900">
                            Mostrando {{ pageStart }} a {{ pageEnd }} de {{ reviews.length }} Entradas
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
    `,
})



export class ReviewListComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() reviews: Review[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();

    filters = {
        review: '',
        rating: '',
        sendDate: '',
    };
    filteredReviews: Review[] = [];

    page: number = 1; // Página actual
    pageSize: number = 6; // Cantidad de servicios por página
    totalPages: number = 1; // Total de páginas
    pageStart: number = 1; // Primer servicio en la página
    pageEnd: number = 6; // Último servicio en la página
    constructor(private _matDialog: MatDialog) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.calculateTotalPages();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['reviews'] && changes['reviews'].currentValue) {
            this.filteredReviews = [...this.reviews];
            this.calculateTotalPages();
            this.updatePageData();
        }
    }
    applyFilters() {
        this.page = 1;
        this.filteredReviews = this.reviews.filter((r) => {
            const matchesReview =
                !this.filters.review ||
                r.review.toLowerCase().includes(this.filters.review.toLowerCase());
            const matchesRating =
                !this.filters.rating || r.rating === parseInt(this.filters.rating, 10);
            const matchesSendDate =
                !this.filters.sendDate ||
                new Date(r.send_date).toISOString().split('T')[0] === this.filters.sendDate;
            return matchesReview && matchesRating && matchesSendDate;
        });
        this.calculateTotalPages();
        this.updatePageData();
    }
    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.filteredReviews.length / this.pageSize);
    }

    // Actualizar los servicios mostrados según la página actual
    private updatePageData(): void {
        const startIndex = (this.page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pageStart = startIndex + 1;
        this.pageEnd = endIndex < this.filteredReviews.length ? endIndex : this.filteredReviews.length;
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
    getStars(rating: number): number[] {
        return new Array(rating).fill(0); // Crea un arreglo con tantas estrellas como la calificación
    }

    // Función para obtener las estrellas vacías
    getEmptyStars(rating: number): number[] {
        return new Array(5 - rating).fill(0); // Crea un arreglo con las estrellas vacías necesarias
    }
}


