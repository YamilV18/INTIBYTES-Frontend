import {DecimalPipe} from "@angular/common";
import {DateTime} from "luxon";
import {EnumValue} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";

export class Billing {

    id?: number;
    amount?: DecimalPipe;
    expiration_date?: Date;
    issue_date?: Date;
    state?: string;
    subscriptions?: {
        id: number;
        user_id: string;
        start_date: DateTime;
        end_date: DateTime;
        status: EnumValue;
    };
    user?: {
        id: number;
        name: string;
        email: string;
        password: string;
        role: EnumValue;
        star_date: DateTime;
        end_date: DateTime;
        status: Boolean;
    }
}
