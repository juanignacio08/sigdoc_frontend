import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  DocenteLaboralRequest,
  DocenteLaboralResponse,
  DocenteLaboralResponseListPaginated,
} from '@shared/models/decanatura/docentelaboral.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocentelaboralService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/work-teacher';

  constructor() {}

  getAllPage(
    page: number,
    size: number,
    documentNumber: string,
  ): Observable<DocenteLaboralResponseListPaginated> {
    const url = `${this.baseUrl}/getByTeacherPage?page=${page}&size=${size}&documentNumber=${documentNumber}`;
    return this.http.get<DocenteLaboralResponseListPaginated>(url);
  }

  save(
    workTeacher: DocenteLaboralRequest,
    file?: File,
  ): Observable<DocenteLaboralResponse> {
    const url = `${this.baseUrl}/save`;
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(workTeacher)], { type: 'application/json' }),
    );

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<DocenteLaboralResponse>(url, formData);
  }

  update(
    workTeacher: DocenteLaboralRequest,
  ): Observable<DocenteLaboralResponse> {
    const url = `${this.baseUrl}/update`;
    return this.http.put<DocenteLaboralResponse>(url, workTeacher);
  }

  enabled(workTeacherId: number): Observable<DocenteLaboralResponse> {
    const url = `${this.baseUrl}/enabled?id=${workTeacherId}`;
    return this.http.put<DocenteLaboralResponse>(url, {});
  }

  disabled(workTeacherId: number): Observable<DocenteLaboralResponse> {
    const url = `${this.baseUrl}/disabled?id=${workTeacherId}`;
    return this.http.put<DocenteLaboralResponse>(url, {});
  }

  delete(workTeacherId: number): Observable<DocenteLaboralResponse> {
    const url = `${this.baseUrl}/delete?id=${workTeacherId}`;
    return this.http.delete<DocenteLaboralResponse>(url);
  }

  canNewAdd(teacherId: number): Observable<boolean> {
    const url = `${this.baseUrl}/canNewAdd?teacherId=${teacherId}`;
    return this.http.get<boolean>(url);
  }

  getPdf(id: number) {
    return this.http.get(`${this.baseUrl}/pdf/${id}`, { responseType: 'blob' });
  }
}
