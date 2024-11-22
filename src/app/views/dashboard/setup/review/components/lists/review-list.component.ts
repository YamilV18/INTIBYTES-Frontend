import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Review } from '../../models/review';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-reviews-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule],
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
            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div *ngFor="let r of reviews; let i = index" class="bg-white rounded-lg shadow-md p-4">
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

        </div>
    `,
})



export class ReviewListComponent implements OnInit {
    abcForms: any;
    @Input() reviews: Review[] = [];
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
    getStars(rating: number): number[] {
        return new Array(rating).fill(0); // Crea un arreglo con tantas estrellas como la calificación
    }

    // Función para obtener las estrellas vacías
    getEmptyStars(rating: number): number[] {
        return new Array(5 - rating).fill(0); // Crea un arreglo con las estrellas vacías necesarias
    }
}


