import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS, EntityDataService, IResponse } from '../../utils';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.user);
    }

    // Metodo para buscar usuarios por nombre
    searchUsers(name: string): Observable<any[]> {
        return this.httpClient.get<any[]>(`${END_POINTS.setup.user}?name=${name}`);
    }

}
