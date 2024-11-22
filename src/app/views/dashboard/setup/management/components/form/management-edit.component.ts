import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Management} from '../../models/management';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-management-edit',
  standalone: true,
    imports: [FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule],
  template: `
    <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
      <!-- Header -->
      <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
        <div class="text-lg font-medium" [innerHTML]="title"></div>
        <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
          <mat-icon
              class="text-current"
              [svgIcon]="'heroicons_outline:x-mark'"
          ></mat-icon>
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
                    <mat-option [value]="2">Invitado</mat-option>
                </mat-select>
                <mat-icon
                    class="icon-size-5"
                    matPrefix
                    [svgIcon]="'heroicons_outline:adjustments-vertical'"
                ></mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Fecha de Inicio</mat-label>
                <input matInput [matDatepicker]="endDatePicker" formControlName="starDate" />
                <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #endDatePicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Fecha de Termino</mat-label>
                <input matInput [matDatepicker]="endDatePicker" formControlName="endDate" />
                <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #endDatePicker></mat-datepicker>
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
                    <button mat-stroked-button [color]="'primary'" (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    </div>
  `
})
export class ManagementEditComponent implements OnInit {
    managementForm = new FormGroup({
        id: new FormControl(null),
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required]),
        starDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        status: new FormControl('', [Validators.required])
    });
  @Input() title: string = '';
  @Input() management = new Management();
  abcForms: any;

  constructor(
      private formBuilder: FormBuilder,
      private _matDialog: MatDialogRef<ManagementEditComponent>,
  ) {
  }

    ngOnInit() {
        this.abcForms = abcForms;

        if (this.management) {
            this.managementForm.patchValue({
                id: this.management.id,
                name: this.management.name,
                email: this.management.email,
                password: this.management.password,
                role: this.management.role?.toString(), // Convert role to string
                starDate: this.management.starDate instanceof Date
                    ? this.management.starDate.toISOString().split('T')[0]
                    : this.management.starDate, // Convert Date to string
                endDate: this.management.endDate instanceof Date
                    ? this.management.endDate.toISOString().split('T')[0]
                    : this.management.endDate, // Convert Date to string
                status: this.management.status === true ? 'true' : 'false' // Convert boolean to string
            });
        }
        }



  public saveForm(): void {
    if (this.managementForm.valid) {
      this._matDialog.close(this.managementForm.value);
    }
  }

  public cancelForm(): void {
    this._matDialog.close('');
  }

}
