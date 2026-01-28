import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FacultadListResponse } from '@shared/models/maestros/facultad.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacultadService {
  constructor() {}

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/faculty';

  getList(): Observable<FacultadListResponse> {
    const url = `${this.baseUrl}/getList`;
    return this.http.get<FacultadListResponse>(url);
  }
}
