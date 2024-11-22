import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {abcForms} from "../../../../environments/generals";

@Component({
  selector: 'app-setup',
  standalone: true,
    imports: [CommonModule, RouterOutlet],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
    public title: string = '';
    abcForms:any;
    constructor() {
    }
    ngOnInit() {
        this.title = 'Configuración'
        this.abcForms = abcForms;
    }
    reviews = [
        { rating: 3, review: "Excelente servicio", send_date: "2024-10-22", update_date: "2024-10-23" },
        { rating: 5, review: "Muy buen producto", send_date: "2024-10-21", update_date: "2024-10-22" },
        { rating: 2, review: "Mejorable", send_date: "2024-10-20", update_date: "2024-10-21" },
    ];

    // Función para obtener las estrellas llenas
    getStars(rating: number): number[] {
        return new Array(rating).fill(0); // Retorna un arreglo con tantas estrellas llenas como la calificación
    }

    // Función para obtener las estrellas vacías
    getEmptyStars(rating: number): number[] {
        return new Array(5 - rating).fill(0); // Rellena el arreglo con el número de estrellas vacías
    }

}
