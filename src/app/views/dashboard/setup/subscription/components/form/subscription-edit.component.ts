import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from '../../models/subscription';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ServiceService } from '../../../../../../providers/services/setup/service.service';

@Component({
    selector: 'app-subscriptions-edit',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium" [innerHTML]="title"></div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Formulario -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="subscriptionForm">
                <div class="text-xl font-semibold mb-4">Detalles de la Suscripción</div>

                <!-- Fecha de Vencimiento -->
                <mat-form-field appearance="fill">
                    <mat-label>Fecha de Vencimiento</mat-label>
                    <input
                        matInput
                        [matDatepicker]="endDatePicker"
                        formControlName="endDate"
                        placeholder="Seleccione una fecha"
                    />
                    <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #endDatePicker></mat-datepicker>
                </mat-form-field>

                <!-- Servicio (readonly) -->
                <mat-form-field appearance="fill" disabled>
                    <mat-label>Servicio</mat-label>
                    <input
                        matInput
                        [value]="getServiceNameById(subscription.service?.id) || 'No especificado'"
                    />
                </mat-form-field>

                <!-- Fecha de Emisión -->
                <mat-form-field appearance="fill">
                    <mat-label>Fecha de Emisión</mat-label>
                    <input
                        matInput
                        [matDatepicker]="startDatePicker"
                        formControlName="starDate"
                        placeholder="Seleccione una fecha"
                    />
                    <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #startDatePicker></mat-datepicker>
                </mat-form-field>

                <!-- Estado -->
                <mat-form-field appearance="fill">
                    <mat-label>Estado</mat-label>
                    <input matInput formControlName="status" placeholder="Ej: Activo, Inactivo" />
                </mat-form-field>

                <!-- Nombre del Usuario (readonly) -->
                <mat-form-field appearance="fill" disabled>
                    <mat-label>Nombre del Usuario</mat-label>
                    <input matInput [value]="subscription.user?.name || 'No especificado'" />
                </mat-form-field>

                <!-- Botones de acción -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button [color]="'primary'" (click)="saveForm()">Guardar</button>
                </div>
            </form>
        </div>
    `,
})
export class SubscriptionEditComponent implements OnInit {
    subscriptionForm: FormGroup;
    services: any[] = []; // Lista de servicios

    @Input() title: string = '';
    @Input() subscription = new Subscription();

    constructor(
        private _matDialog: MatDialogRef<SubscriptionEditComponent>,
        private serviceService: ServiceService // Servicio para cargar los servicios
    ) {
        this.subscriptionForm = new FormGroup({
            endDate: new FormControl(null, [Validators.required]),
            starDate: new FormControl(null, [Validators.required]),
            status: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.loadServices(); // Cargar servicios al iniciar
        if (this.subscription) {
            this.subscriptionForm.patchValue({
                endDate: this.subscription.endDate,
                starDate: this.subscription.starDate,
                status: this.subscription.status,
            });
        }
    }

    private loadServices(): void {
        this.serviceService.getAll$().subscribe({
            next: (response) => {
                this.services = response;
            },
            error: (err) => {
                console.error('Error cargando servicios:', err);
            },
        });
    }

    public getServiceNameById(serviceId: number | undefined): string | undefined {
        const service = this.services.find((s) => s.id === serviceId);
        return service?.name;
    }

    public saveForm(): void {
        if (this.subscriptionForm.valid) {
            const formData = this.subscriptionForm.getRawValue();

            const updatedSubscription: Subscription = {
                ...this.subscription,
                endDate: formData.endDate,
                starDate: formData.starDate,
                status: formData.status,
            };

            this._matDialog.close(updatedSubscription);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
