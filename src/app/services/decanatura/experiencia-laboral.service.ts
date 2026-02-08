import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExperienciaProfesionalRequest, ExperienciaProfesionalResponse, ExperienciaProfesionalResponseListPaginated } from '@shared/models/decanatura/docenteexperiencia.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaLaboralService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/experience';

  constructor() {}

  getAllPage(
    page: number,
    size: number,
    documentNumber: string,
  ): Observable<ExperienciaProfesionalResponseListPaginated> {
    const url = `${this.baseUrl}/getByTeacherPage?page=${page}&size=${size}&documentNumber=${documentNumber}`;
    return this.http.get<ExperienciaProfesionalResponseListPaginated>(url);
  }

  save(profetionalExperiencie: ExperienciaProfesionalRequest): Observable<ExperienciaProfesionalResponse> {
    const url = `${this.baseUrl}/save`;
    return this.http.post<ExperienciaProfesionalResponse>(url, profetionalExperiencie);
  }

  update(
    profetionalExperiencie: ExperienciaProfesionalRequest,
  ): Observable<ExperienciaProfesionalResponse> {
    const url = `${this.baseUrl}/update`;
    return this.http.put<ExperienciaProfesionalResponse>(url, profetionalExperiencie);
  }

  delete(profetionalExperiencieId: number): Observable<ExperienciaProfesionalRequest> {
    const url = `${this.baseUrl}/delete?id=${profetionalExperiencieId}`;
    return this.http.delete<ExperienciaProfesionalRequest>(url);
  }

}
