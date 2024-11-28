import { Review } from '../models/review';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReviewNewComponent } from '../components/form/review-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewEditComponent } from '../components/form/review-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";

import {ReviewService} from "../../../../../providers/services/setup/review.service";
import {ReviewListComponent} from "../components";



@Component({
    selector: 'app-review-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ReviewListComponent,
        ReviewNewComponent,
        ReviewEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-reviews-list
            class="w-full"
            [reviews]="reviews"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-reviews-list>
    `,
})
export class ReviewContainerComponent implements OnInit {
    public error: string = '';
    public reviews: Review[] = [];
    public review = new Review();

    constructor(
        private _reviewServices: ReviewService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getReviews();
        this._reviewServices.getAll$().subscribe({
            next: (response) => {
                this.reviews = response;
            },
            error: (err) => {
                console.error('Error al cargar reseñas:', err);
            },
        });
    }

    getReviews(): void {
        this._reviewServices.getAll$().subscribe({
            next: (response) => {
                this.reviews = response;
            },
            error: (err) => {
                console.error('Error al obtener las reseñas:', err);
                this.error = 'Error al obtener las reseñas.';
            }
        });
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const reviewForm = this._matDialog.open(ReviewNewComponent);
            reviewForm.componentInstance.title = 'Nueva Reseña' || null;
            reviewForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveReview(result);
                }
            });
        }
    }

    saveReview(data: Object): void {
        this._reviewServices.add$(data).subscribe((response) => {
            if (response) {
                this.getReviews()
            }
        });
    }

    eventEdit(idReview: number): void {
        const listById = this._reviewServices
            .getById$(idReview)
            .subscribe(async (response) => {
                this.review = (response) || {};
                this.openModalEdit(this.review);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Review) {
        console.log(data);
        if (data) {
            const reviewForm = this._matDialog.open(ReviewEditComponent);
            reviewForm.componentInstance.title =`Editar <b>${data.review||data.id} </b>`;
            reviewForm.componentInstance.review = data;
            reviewForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editReview( data.id,result);
                }
            });
        }
    }

    editReview( idReview: number,data: Object) {
        this._reviewServices.update$(idReview,data).subscribe((response) => {
            if (response) {
                this.getReviews()
            }
        });
    }


    public eventDelete(idReview: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: ¿Quieres proceder con esta acción ${}?,
            }
        ).then(() => {
            this._reviewServices.delete$(idReview).subscribe((response) => {
                this.reviews = response;
            });
            this.getReviews();
        }).catch(() => {
        });

    }
}
