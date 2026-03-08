import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EscuelaProfesionalListResponse } from '@shared/models/maestros/escuelaprofesional.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EscuelaprofesionalService {
  constructor() {}

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/professional-school';

  getByAcademicApartment(
    academicApartmentId: number,
  ): Observable<EscuelaProfesionalListResponse> {
    const url = `${this.baseUrl}/getByAcademicApartment?academicApartmentId=${academicApartmentId}`;
    return this.http.get<EscuelaProfesionalListResponse>(url);
  }
}
