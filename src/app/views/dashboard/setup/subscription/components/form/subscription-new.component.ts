import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-clients-new',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
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
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="subscriptionForm">
                <!-- Fecha de Vencimiento -->
                <mat-form-field appearance="outline">
                    <mat-label>Fecha de Vencimiento</mat-label>
                    <input matInput [matDatepicker]="endDatePicker" formControlName="enddate" />
                    <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #endDatePicker></mat-datepicker>
                </mat-form-field>

                <!-- Campo para el ID -->
                <mat-form-field appearance="outline">
                    <mat-label>service</mat-label>
                    <input matInput formControlName="service" />
                </mat-form-field>

                <!-- Fecha de Emisión -->
                <mat-form-field appearance="outline">
                    <mat-label>Fecha de Emisión</mat-label>
                    <input matInput [matDatepicker]="startDatePicker" formControlName="stardate" />
                    <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #startDatePicker></mat-datepicker>
                </mat-form-field>

                <!-- Estado -->
                <mat-form-field appearance="outline">
                    <mat-label>Estado</mat-label>
                    <input matInput formControlName="status" />
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
export class SubscriptionNewComponent implements OnInit {
    @Input() title: string = '';
    subscriptionForm = new FormGroup({
        enddate: new FormControl<Date | null>(null, [Validators.required]),
        service: new FormControl(null, [Validators.required]),
        stardate: new FormControl<Date | null>(null, [Validators.required]),
        status: new FormControl('', [Validators.required]),
    });

    constructor(private _matDialog: MatDialogRef<SubscriptionNewComponent>) {}

    ngOnInit() {}

    public saveForm(): void {
        if (this.subscriptionForm.valid) {
            const formData = this.subscriptionForm.value;
            formData.service = {
                id: formData.service,
                description: null,
                name: null,
                price: null,
                category_id: null,
            }
            this._matDialog.close(formData);

        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
