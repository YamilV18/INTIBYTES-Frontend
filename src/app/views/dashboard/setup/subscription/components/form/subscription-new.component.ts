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
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ServiceService } from '../../../../../../providers/services/setup/service.service';
import { UserService } from '../../../../../../providers/services/setup/user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-subscriptions-new',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatOptionModule,
        MatAutocompleteModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium" [innerHTML]="title"></div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="subscriptionForm">
                <div class="text-xl font-semibold mb-4">Nueva Suscripción</div>

                <!-- Servicio -->
                <mat-form-field appearance="fill">
                    <mat-label>Seleccione un Servicio</mat-label>
                    <mat-select formControlName="serviceId" required>
                        <mat-option *ngFor="let service of services" [value]="service.id">
                            {{ service.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>

                <!-- Búsqueda de Usuario -->
                <mat-form-field appearance="fill">
                    <mat-label>Buscar Usuario</mat-label>
                    <input
                        matInput
                        [formControl]="searchControl"
                        placeholder="Ingrese el nombre del usuario"
                        [matAutocomplete]="auto"
                    />
                    <mat-autocomplete #auto="matAutocomplete">
                        <mat-option
                            *ngFor="let user of filteredUsers"
                            [value]="user.id"
                            (click)="selectUser(user)"
                        >
                            {{ user.name }}
                        </mat-option>
                    </mat-autocomplete>
                </mat-form-field>

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

                <!-- Fecha de Inicio -->
                <mat-form-field appearance="fill">
                    <mat-label>Fecha de Inicio</mat-label>
                    <input
                        matInput
                        [matDatepicker]="starDatePicker"
                        formControlName="starDate"
                        placeholder="Seleccione una fecha"
                    />
                    <mat-datepicker-toggle matSuffix [for]="starDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #starDatePicker></mat-datepicker>
                </mat-form-field>



                <!-- Estado -->
                <mat-form-field appearance="fill">
                    <mat-label>Estado</mat-label>
                    <input matInput formControlName="status" placeholder="Ej: Activo, Inactivo" />
                </mat-form-field>

                <!-- Botones -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button [color]="'primary'" (click)="saveForm()" [disabled]="!subscriptionForm.valid">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    `,
})
export class SubscriptionNewComponent implements OnInit {
    @Input() title: string = '';

    subscriptionForm = new FormGroup({
        serviceId: new FormControl(null, [Validators.required]),
        userId: new FormControl(null, [Validators.required]),
        endDate: new FormControl<Date | null>(null, [Validators.required]),
        starDate: new FormControl<Date | null>(null, [Validators.required]),
        status: new FormControl('', [Validators.required]),
    });

    services: any[] = [];
    searchControl = new FormControl('');
    filteredUsers: any[] = [];

    constructor(
        private _matDialog: MatDialogRef<SubscriptionNewComponent>,
        private serviceService: ServiceService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.loadServices();
        this.setupUserSearch();
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

    private setupUserSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => this.userService.searchUsers(query))
            )
            .subscribe({
                next: (users) => {
                    this.filteredUsers = users;
                },
                error: (err) => {
                    console.error('Error buscando usuarios:', err);
                },
            });
    }

    public saveForm(): void {
        if (this.subscriptionForm.valid) {
            const formData = this.subscriptionForm.getRawValue();

            // Procesar las fechas si es necesario
            const payload = {
                serviceId: formData.serviceId, // ID del servicio seleccionado
                user: this.filteredUsers.find(user => user.id === formData.userId) || null, // Usuario completo
                starDate: formData.starDate ? new Date(formData.starDate).toISOString() : null, // Formato ISO para la fecha
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null, // Formato ISO para la fecha
                status: formData.status, // Estado
            };

            console.log('Payload generado:', payload); // Debug del payload
            this._matDialog.close(payload);
        } else {
            console.error('Formulario inválido:', this.subscriptionForm.errors);
        }
    }



    public selectUser(user: any): void {
        this.subscriptionForm.patchValue({ userId: user.id });
    }




    public cancelForm(): void {
        this._matDialog.close('');
    }


}
