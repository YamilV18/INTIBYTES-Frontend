import { Billing } from '../models/billing';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BillingNewComponent } from '../components/form/billing-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingEditComponent } from '../components/form/billing-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {BillingListComponent} from "../components";
import {BillingService} from "../../../../../providers/services/setup/billing.service";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        BillingListComponent,
        BillingNewComponent,
        BillingEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-billings-list
            class="w-full"
            [billings]="billings"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-billings-list>
    `,
})
export class BillingContainerComponent implements OnInit {
    public error: string = '';
    public billings: Billing[] = [];
    public billing = new Billing();

    constructor(
        private _billingService: BillingService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._billingService.getAll$().subscribe(
            (response) => {
                this.billings = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(BillingNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Historial' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: Object): void {
        this._billingService.add$(data).subscribe((response) => {
        if (response) {
            this.getClients()
        }
        });
    }

    eventEdit(idClient: number): void {
        const listById = this._billingService
            .getById$(idClient)
            .subscribe(async (response) => {
                this.billing = (response) || {};
                this.openModalEdit(this.billing);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Billing) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(BillingEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.amount||data.id} </b>`;
            clienteForm.componentInstance.billing = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient( data.id,result);
                }
            });
        }
    }

    editClient( idClient: number,data: Object) {
        this._billingService.update$(idClient,data).subscribe((response) => {
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
            this._billingService.delete$(idClient).subscribe((response) => {
                this.billings = response;
            });
            this.getClients();
        }).catch(() => {
        });

    }
}
