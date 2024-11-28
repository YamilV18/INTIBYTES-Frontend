import { Service } from '../models/service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceNewComponent } from '../components/form/service-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceEditComponent } from '../components/form/service-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ServiceListComponent} from "../components";
import {ServiceService} from "../../../../../providers/services/setup/service.service";

@Component({
    selector: 'app-services-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ServiceListComponent,
        ServiceNewComponent,
        ServiceEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-service-list
            class="w-full"
            [service]="services"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-service-list>
    `,
})
export class ServiceContainerComponent implements OnInit {
    public error: string = '';
    public services: Service[] = [];
    public service = new Service();

    constructor(
        private _serviceService: ServiceService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getServices();
        this._serviceService.getAll$().subscribe({
            next: (response) => {
                this.services = response;
            },
            error: (err) => {
                console.error('Error al cargar servicios:', err);
            },
        });
    }

    getServices(): void {
        this._serviceService.getAll$().subscribe(
            (response) => {
                this.services = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const serviceForm = this._matDialog.open(ServiceNewComponent);
            serviceForm.componentInstance.title = 'Nuevo Service' || null;
            serviceForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveService(result);
                }
            });
        }
    }

    saveService(data: Object): void {
        this._serviceService.add$(data).subscribe((response) => {
        if (response) {
            this.getServices()
        }
        });
    }

    eventEdit(idService: number): void {
        const listById = this._serviceService
            .getById$(idService)
            .subscribe(async (response) => {
                this.service = (response) || {};
                this.openModalEdit(this.service);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Service) {
        console.log(data);
        if (data) {
            const serviceForm = this._matDialog.open(ServiceEditComponent);
            serviceForm.componentInstance.title =`Editar <b>${data.name||data.id} </b>`;
            serviceForm.componentInstance.client = data;
            serviceForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editService( data.id,result);
                }
            });
        }
    }

    editService( idService: number,data: Object) {
        this._serviceService.update$(idService,data).subscribe((response) => {
            if (response) {
                this.getServices()
            }
        });
    }


    public eventDelete(idService: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._serviceService.delete$(idService).subscribe((response) => {
                this.services = response;
            });
            this.getServices();
        }).catch(() => {
        });

    }
}
