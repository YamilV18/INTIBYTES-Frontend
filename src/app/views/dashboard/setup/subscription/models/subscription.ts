import {DecimalPipe} from "@angular/common";


export class Subscription {

    id?: number;
    enddate?: Date;
    service?: {
        id: number;
        description: string;
        name: string;
        price: number;
        category_id: number;
    }
    stardate?: Date;
    status?: string;
    }
