import {DecimalPipe} from "@angular/common";
import {EnumValue} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";


export class Subscription {

    id?: number;
    endDate?: Date;
    service?: {
        id: number;
        description: string;
        name: string;
        price: number;
        category_id: number;
    }
    starDate?: Date;
    status?: string;
    user?: {
        id?: number;
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        starDate?: Date;
        endDate?: Date;
        status?: Boolean;
    }
}
