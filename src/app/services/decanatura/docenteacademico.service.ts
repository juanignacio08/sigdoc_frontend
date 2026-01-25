import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DocenteAcademicoRequest, DocenteAcademicoResponse, DocenteAcademicoResponseListPaginated } from '@shared/models/decanatura/docenteacademico.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteacademicoService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/teacher-academic';

  constructor() {}

  getAllPage(
    page: number,
    size: number,
    documentNumber: string,
  ): Observable<DocenteAcademicoResponseListPaginated> {
    const url = `${this.baseUrl}/getByTeacherPage?page=${page}&size=${size}&documentNumber=${documentNumber}`;
    return this.http.get<DocenteAcademicoResponseListPaginated>(url);
  }

  save(academicTeacher: DocenteAcademicoRequest): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/save`;
    return this.http.post<DocenteAcademicoResponse>(url, academicTeacher);
  }

  update(academicTeacher: DocenteAcademicoRequest): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/update`;
    return this.http.put<DocenteAcademicoResponse>(url, academicTeacher);
  }

  delete(academicTeacherId: number): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/delete?id=${academicTeacherId}`;
    return this.http.delete<DocenteAcademicoResponse>(url);
  }
}
