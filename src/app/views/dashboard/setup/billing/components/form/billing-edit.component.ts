import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Billing} from '../../models/billing';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-billings-edit',
  standalone: true,
  imports: [FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule, MatFormFieldModule, MatInputModule],
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
        <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="billingForm">
            <mat-form-field>
                <mat-label>Cantidad</mat-label>
                <input matInput formControlName="amount" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Fecha de Vencimiento</mat-label>
                <input matInput formControlName="expiration_date" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Fecha de Emisión</mat-label>
                <input matInput formControlName="issue_date" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Estado</mat-label>
                <input matInput formControlName="state" />
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
export class BillingEditComponent implements OnInit {
    billingForm: FormGroup;

    @Input() title: string = '';
    @Input() billing = new Billing();

    constructor(
        private _matDialog: MatDialogRef<BillingEditComponent>
    ) {
        this.billingForm = new FormGroup({
            amount: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/) // Valida número decimal con hasta 2 decimales
            ]),
            expiration_date: new FormControl(null, [
                Validators.required,
            ]),
            issue_date: new FormControl(null, [
                Validators.required,
            ]),
            state: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        if (this.billing) {
            this.billingForm.patchValue({
                amount: this.billing.amount,
                expiration_date: this.billing.expiration_date,
                issue_date: this.billing.issue_date,
                state: this.billing.state
            });
        }
    }

    public saveForm(): void {
        if (this.billingForm.valid) {
            this._matDialog.close(this.billingForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
