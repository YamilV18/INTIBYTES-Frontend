import {EnumValue} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";

export class Management {

    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role?: EnumValue;
    starDate?: Date;
    endDate?: Date;
    status?: Boolean;
}
