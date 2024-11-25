import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS, EntityDataService, IResponse } from '../../utils';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.service);
    }

    // Nuevo método para obtener un servicio por ID
    getServiceById(serviceId: number): Observable<any> {
        return this.httpClient.get(`${END_POINTS.setup.service}/${serviceId}`);
    }

    // Método para obtener un servicio por nombre
    getServiceByName(serviceName: string): Observable<any> {
        return this.httpClient.get(`${END_POINTS.setup.service}?name=${serviceName}`);
    }

}
