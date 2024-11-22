import { Component, Input, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { abcForms } from '../../../../../../../environments/generals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from "@angular/material/select";
import {CategoryService} from "../../../../../../providers/services/setup/category.service";
import {CommonModule} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";

@Component({
    selector: 'app-clients-new',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatOptionModule,
        MatInputModule,
        MatSelectModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">{{ title }}</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>


            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="clientForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="name" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Descripción</mat-label>
                    <input matInput formControlName="description" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Precio</mat-label>
                    <input matInput formControlName="price" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Categoría</mat-label>
                    <mat-select formControlName="category">
                        <mat-option *ngFor="let category of categories" [value]="category.id">
                            {{ category.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                        <button mat-stroked-button [color]="'primary'" (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class ServiceNewComponent implements OnInit {
    @Input() title: string = '';
    @Input() categories: any[] = [];
    abcForms: any;
    clientForm = new FormGroup({

        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(
        private categoryService: CategoryService,
        private _matDialog: MatDialogRef<ServiceNewComponent>
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.loadCategories();
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

    public saveForm(): void {
        if (this.clientForm.valid) {
            const formData = this.clientForm.value;
            formData.category = {
                id: formData.category,
                name: null,
                description: null
            }
            console.log('Datos enviados al backend:', formData);
            this._matDialog.close(formData);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
