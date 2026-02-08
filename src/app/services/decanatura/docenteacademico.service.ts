import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  DocenteAcademicoRequest,
  DocenteAcademicoResponse,
  DocenteAcademicoResponseListPaginated,
} from '@shared/models/decanatura/docenteacademico.model';
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

  save(
    academicTeacher: DocenteAcademicoRequest,
    file?: File,
  ): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/save`;
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(academicTeacher)], { type: 'application/json' }),
    );

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<DocenteAcademicoResponse>(url, formData);
  }

  update(
    academicTeacher: DocenteAcademicoRequest,
    file?: File,
  ): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/update`;
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(academicTeacher)], { type: 'application/json' }),
    );

    if (file) {
      formData.append('file', file);
    }

    return this.http.put<DocenteAcademicoResponse>(url, formData);
  }

  delete(academicTeacherId: number): Observable<DocenteAcademicoResponse> {
    const url = `${this.baseUrl}/delete?id=${academicTeacherId}`;
    return this.http.delete<DocenteAcademicoResponse>(url);
  }

  getPdf(id: number) {
    return this.http.get(`${this.baseUrl}/pdf/${id}`, { responseType: 'blob' });
  }
}
