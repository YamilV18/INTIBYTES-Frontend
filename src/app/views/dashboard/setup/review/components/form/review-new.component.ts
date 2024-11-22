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

@Component({
    selector: 'app-categories-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        //BrowserAnimationsModule, // Obligatorio para Angular Material
        MatSelectModule,
        MatFormFieldModule,

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
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="reviewForm">
                <mat-form-field appearance="fill">
                    <mat-label>Rating</mat-label>
                    <mat-select formControlName="rating" required>
                         <mat-option value="1">1</mat-option>
                        <mat-option value="2">2</mat-option>
                        <mat-option value="3">3</mat-option>
                        <mat-option value="4">4</mat-option>
                        <mat-option value="5">5</mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Reseña</mat-label>
                    <input matInput formControlName="review" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Fecha de Envio</mat-label>
                    <input matInput formControlName="send_date" type="date" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Fecha de Actualizar</mat-label>
                    <input matInput formControlName="update_date" type="date" />
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
export class ReviewNewComponent implements OnInit {
    @Input() title: string = '';
    abcForms: any;




    reviewForm = new FormGroup({
        rating: new FormControl('', [Validators.required]), // Corregido de 'ratting' a 'rating'
        review: new FormControl('', [Validators.required]),
        send_date: new FormControl('', [Validators.required]),
        update_date: new FormControl('', [Validators.required])
    });

    constructor(private _matDialog: MatDialogRef<ReviewNewComponent>) {}

    ngOnInit() {
        // Obtener la fecha actual
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formato: yyyy-MM-dd

        // Asignar la fecha actual a los campos
        this.reviewForm.patchValue({
            send_date: formattedDate,
            update_date: formattedDate,
        });
    }

    public saveForm(): void {
        if (this.reviewForm.valid) {
            this._matDialog.close(this.reviewForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
