import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartamentoAcademicoListResponse } from '@shared/models/maestros/departamentoacademico.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoacademicoService {

  constructor() {}

  http = inject(HttpClient);
  
  private readonly baseUrl = environment.apiUrl + "/academic-department";

  getByFaculty(facultyId: number): Observable<DepartamentoAcademicoListResponse> {
    const url = `${this.baseUrl}/getByFaculty?facultyId=${facultyId}`;
    return this.http.get<DepartamentoAcademicoListResponse>(url);
  }
}
