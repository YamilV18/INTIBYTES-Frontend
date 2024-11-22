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
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-management-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">{{ title }}</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="managementForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="name" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Contraseña</mat-label>
                    <input matInput formControlName="password" />
                </mat-form-field>
                <mat-form-field>
                    <mat-select [placeholder]="'Roles'" formControlName="role">
                        <mat-option [value]="0">Administrador</mat-option>
                        <mat-option [value]="1">Colaborador</mat-option>
                        <mat-option [value]="1">Invitado</mat-option>
                    </mat-select>
                    <mat-icon
                        class="icon-size-5"
                        matPrefix
                        [svgIcon]="'heroicons_outline:adjustments-vertical'"
                    ></mat-icon>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Fecha de Inicio</mat-label>
                    <input matInput formControlName="starDate" type="date" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Fecha de Termino</mat-label>
                    <input matInput formControlName="endDate" type="date" />
                </mat-form-field>
                <mat-form-field>
                    <mat-select [placeholder]="'Estado'" formControlName="status">
                        <mat-option [value]="true">Activo</mat-option>
                        <mat-option [value]="false">Inactivo</mat-option>
                    </mat-select>
                    <mat-icon
                        class="icon-size-5"
                        matPrefix
                        [svgIcon]="'heroicons_outline:adjustments-vertical'"
                    ></mat-icon>
                </mat-form-field>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                        <button mat-stroked-button [color]="'primary'" (click)="saveForm()">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class ManagementNewComponent implements OnInit {
    @Input() title: string = '';
    abcForms: any;

    managementForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required]),
        starDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        status: new FormControl(null, [Validators.required]), // Asignar null o un valor booleano
    });

    constructor(private _matDialog: MatDialogRef<ManagementNewComponent>) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public saveForm(): void {
        if (this.managementForm.valid) {
            // Si el formulario es válido, lo cerramos y pasamos los datos
            this._matDialog.close(this.managementForm.value);
        }
    }

    public cancelForm(): void {
        // Si se cancela el formulario, cerramos el modal sin enviar nada
        this._matDialog.close('');
    }
}
