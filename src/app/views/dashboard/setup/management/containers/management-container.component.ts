import { Management } from '../models/management';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManagementNewComponent } from '../components/form/management-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementEditComponent } from '../components/form/management-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import { ManagementListComponent} from "../components";
import {UserService} from "../../../../../providers/services/setup/user.service";

@Component({
    selector: 'app-management-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ManagementListComponent,
        ManagementNewComponent,
        ManagementEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-management-list
            class="w-full"
            [managements]="managements"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-management-list>
    `,
})
export class ManagementContainerComponent implements OnInit {
    public error: string = '';
    public managements: Management[] = [];
    public management = new Management();

    constructor(
        private _managementService: UserService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
        this._managementService.getAll$().subscribe({
            next: (response) => {
                this.managements = response;
            },
            error: (err) => {
                console.error('Error al cargar usuarios:', err);
            },
        });
    }

    getClients(): void {
        this._managementService.getAll$().subscribe(
            (response) => {
                this.managements = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const managementForm = this._matDialog.open(ManagementNewComponent);
            managementForm.componentInstance.title = 'Nuevo Usuario' || null;
            managementForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveManagement(result);
                }
            });
        }
    }

    saveManagement(data: Object): void {
        this._managementService.add$(data).subscribe((response) => {
        if (response) {
            this.getClients()
        }
        });
    }

    eventEdit(idClient: number): void {
        this._managementService.getById$(idClient).subscribe((response) => {
            // Si la respuesta es válida, asignamos los datos al modelo
            this.management = response || {};
            this.openModalEdit(this.management);
        });
    }

    openModalEdit(data: Management): void {
        console.log(data);
        if (data) {
            // Abriendo el modal con los datos del cliente
            const managementForm = this._matDialog.open(ManagementEditComponent);

            // Asignando el título dinámicamente
            managementForm.componentInstance.title = `Editar <b>${data.name || data.id}</b>`;

            // Pasando los datos del cliente al componente del modal
            managementForm.componentInstance.management = data;

            // Subscribiéndonos a la respuesta al cerrar el modal
            managementForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Si el resultado no es null/undefined, se actualiza el cliente
                    this.editManagementForm(data.id, result);
                }
            });
        }
    }

    editManagementForm(idClient: number, data: Management): void {
        // Llamada al servicio para actualizar los datos del cliente
        this._managementService.update$(idClient, data).subscribe((response) => {
            if (response) {
                // Si la actualización es exitosa, refrescar la lista de clientes
                this.getClients();
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
            this._managementService.delete$(idClient).subscribe((response) => {
                this.management = response;
            });
            this.getClients();
        }).catch(() => {
        });

    }
}
