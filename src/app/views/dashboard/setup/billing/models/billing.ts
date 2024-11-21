import {DecimalPipe} from "@angular/common";

export class Billing {

    id?: number;
    amount?: DecimalPipe;
    expiration_date?: Date;
    issue_date?: Date;
    state?: string;
    subscription_id?: number;
}
