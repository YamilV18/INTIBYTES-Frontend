import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Service} from '../../models/service';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../../../../../../providers/services/setup/category.service";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-client-edit',
  standalone: true,
    imports: [FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf],
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
        <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="clientForm">
            <mat-form-field>
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="name" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Descripción</mat-label>
                <input matInput formControlName="description" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Price</mat-label>
                <input matInput formControlName="price" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="category">
                    <mat-option *ngFor="let category of categories" [value]="category.id">
                        {{ category.name }}
                    </mat-option>
                </mat-select>
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
export class ServiceEditComponent implements OnInit {
    clientForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required]),
        category: new FormControl(null, [Validators.required]),
    });
  @Input() title: string = '';
  @Input() client = new Service();
    @Input() categories: any[] = [];

    abcForms: any;

  constructor(
      private _matDialog: MatDialogRef<ServiceEditComponent>,
      private categoryService: CategoryService,

  ) {
  }

  ngOnInit() {
    this.abcForms = abcForms;
      this.loadCategories();

      if (this.client) {
          this.clientForm.patchValue({
              ...this.client,
              category: this.client.category.id || null,
          });
      }
  }

    private loadCategories(): void {
        this.categoryService.getCategories().subscribe(
            (data) => {
                this.categories = data;
            },
            (error) => {
                console.error('Error al cargar categorías:', error);
            }
        );
    }
    public saveForm(): void {
        if (this.clientForm.valid) {
            const formData = this.clientForm.value;
            formData.category = {
                id: formData.category,
                name: null,
                description: null
            }
            console.log('Datos enviados al backend:', formData);
            this._matDialog.close(formData);
        }
    }

  public cancelForm(): void {
    this._matDialog.close('');
  }
}
