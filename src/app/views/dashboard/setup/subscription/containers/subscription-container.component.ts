import { Subscription } from '../models/subscription';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionNewComponent } from '../components/form/subscription-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionEditComponent } from '../components/form/subscription-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {SubscriptionService} from "../../../../../providers/services/setup/subscription.service";
import {SubscriptionListComponent} from "../components/lists/subscription-list.component";

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
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._subscriptionService.getAll$().subscribe(
            (response) => {
                this.subscriptions = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(SubscriptionNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Historial' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: Object): void {
        this._subscriptionService.add$(data).subscribe((response) => {
            if (response) {
                this.getClients()
            }
        });
    }

    eventEdit(idClient: number): void {
        const listById = this._subscriptionService
            .getById$(idClient)
            .subscribe(async (response) => {
                this.subscription = (response) || {};
                this.openModalEdit(this.subscription);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Subscription) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(SubscriptionEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.status||data.id} </b>`;
            clienteForm.componentInstance.subscription = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient( data.id,result);
                }
            });
        }
    }

    editClient( idClient: number,data: Object) {
        this._subscriptionService.update$(idClient,data).subscribe((response) => {
            if (response) {
                this.getClients()
            }
        });
    }


    public eventDelete(idClient: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._subscriptionService.delete$(idClient).subscribe((response) => {
                this.subscriptions = response;
            });
            this.getClients();
        }).catch(() => {
        });

    }
}
