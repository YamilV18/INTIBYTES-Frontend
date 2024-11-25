import { Subscription } from '../models/subscription';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionNewComponent } from '../components/form/subscription-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionEditComponent } from '../components/form/subscription-edit.component';
import { ConfirmDialogService } from '../../../../../shared/confirm-dialog/confirm-dialog.service';
import { SubscriptionService } from '../../../../../providers/services/setup/subscription.service';
import { SubscriptionListComponent } from '../components/lists/subscription-list.component';

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SubscriptionListComponent,
        SubscriptionNewComponent,
        SubscriptionEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-subscriptions-list
            class="w-full"
            [subscriptions]="subscriptions"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-subscriptions-list>
    `,
})
export class SubscriptionContainerComponent implements OnInit {
    public error: string = '';
    public subscriptions: Subscription[] = [];
    public subscription = new Subscription();

    constructor(
        private _subscriptionService: SubscriptionService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._subscriptionService.getAll$().subscribe({
            next: (response) => {
                this.subscriptions = response;
            },
            error: (error) => {
                this.error = error;
            },
        });
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const subscriptionForm = this._matDialog.open(SubscriptionNewComponent);
            subscriptionForm.componentInstance.title = 'Nueva Suscripción';

            subscriptionForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    console.log('Datos recibidos para nueva suscripción:', result);
                    this.saveSubscription(result);
                }
            });
        }
    }

    saveSubscription(data: any): void {
        const payload = {
            serviceId: data.serviceId, // ID del servicio
            user: data.user || null, // Usuario completo
            starDate: data.starDate ? new Date(data.starDate).toISOString() : null, // Formato ISO para la fecha
            endDate: data.endDate ? new Date(data.endDate).toISOString() : null, // Formato ISO para la fecha
            status: data.status, // Estado
        };

        console.log('Payload enviado al backend:', payload); // Debug

        this._subscriptionService.add$(payload).subscribe({
            next: (response) => {
                console.log('Respuesta del backend (guardar):', response);
                this.getClients(); // Actualizar la lista
            },
            error: (err) => {
                console.error('Error al guardar la suscripción:', err);
            },
        });
    }





    eventEdit(idClient: number): void {
        const subscriptionById = this._subscriptionService.getById$(idClient).subscribe({
            next: (response) => {
                this.subscription = response || {};
                this.openModalEdit(this.subscription);
                subscriptionById.unsubscribe();
            },
            error: (err) => {
                console.error('Error al obtener suscripción para edición:', err);
            },
        });
    }

    openModalEdit(data: Subscription) {
        if (data) {
            const subscriptionForm = this._matDialog.open(SubscriptionEditComponent);
            subscriptionForm.componentInstance.title = `Editar Suscripción ${data.id}`;
            subscriptionForm.componentInstance.subscription = data;

            subscriptionForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    console.log('Datos recibidos para edición:', result);
                    this.editClient(data.id, result);
                }
            });
        }
    }

    editClient(idClient: number, data: any): void {
        this._subscriptionService.update$(idClient, data).subscribe({
            next: (response) => {
                console.log('Suscripción actualizada correctamente:', response);
                this.getClients(); // Actualizar lista
            },
            error: (err) => {
                console.error('Error al actualizar la suscripción:', err);
            },
        });
    }

    public eventDelete(idClient: number): void {
        this._confirmDialogService
            .confirmDelete({})
            .then(() => {
                this._subscriptionService.delete$(idClient).subscribe({
                    next: (response) => {
                        console.log('Suscripción eliminada correctamente:', response);
                        this.getClients(); // Actualizar lista
                    },
                    error: (err) => {
                        console.error('Error al eliminar la suscripción:', err);
                    },
                });
            })
            .catch(() => {
                console.log('Eliminación cancelada.');
            });
    }
}
