import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Subscription} from '../../models/subscription';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-subscriptions-edit',
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
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="subscriptionForm">

                <mat-form-field>
                    <mat-label>Fecha de Vencimiento</mat-label>
                    <input matInput formControlName="enddate" />
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Fecha de Emisión</mat-label>
                    <input matInput formControlName="stardate" />
                </mat-form-field>

                <mat-form-field>
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
    `
})
export class SubscriptionEditComponent implements OnInit {
    subscriptionForm: FormGroup;

    @Input() title: string = '';
    @Input() subscription = new Subscription();

    constructor(
        private _matDialog: MatDialogRef<SubscriptionEditComponent>
    ) {
        this.subscriptionForm = new FormGroup({
            enddate: new FormControl(null, [
                Validators.required,
            ]),

            stardate: new FormControl(null, [
                Validators.required,
            ]),
            status: new FormControl('', [Validators.required]),
        });
    }



    ngOnInit() {
        if (this.subscription) {
            this.subscriptionForm.patchValue({
                enddate: this.subscription.enddate,
                stardate: this.subscription.stardate,
                status: this.subscription.status
            });
        }
    }

    public saveForm(): void {
        if (this.subscriptionForm.valid) {
            this._matDialog.close(this.subscriptionForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
