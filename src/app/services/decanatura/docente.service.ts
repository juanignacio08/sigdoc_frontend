import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  DocenteRequest,
  DocenteResponse,
  DocenteResponseListPaginated,
} from '@shared/models/decanatura/docente.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import { number } from 'echarts';
import { DocenteFilter } from '../../shared/models/decanatura/docente.model';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/teacher';

  save(teacher: DocenteRequest, file?: File): Observable<DocenteResponse> {
    const url = `${this.baseUrl}/save`;
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(teacher)], { type: 'application/json' }),
    );

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<DocenteResponse>(url, formData);
  }

  update(teacher: DocenteRequest, file?: File): Observable<DocenteResponse> {
    const url = `${this.baseUrl}/update`;
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(teacher)], { type: 'application/json' }),
    );

    if (file) {
      formData.append('file', file);
    }
    return this.http.put<DocenteResponse>(url, formData);
  }

  getDetail(documentNumber: string): Observable<DocenteResponse> {
    const url = `${this.baseUrl}/getDetail?documentNumber=${documentNumber}`;
    return this.http.get<DocenteResponse>(url);
  }

  getAllPage(
    page: number,
    size: number,
  ): Observable<DocenteResponseListPaginated> {
    const url = `${this.baseUrl}/getPage?page=${page}&size=${size}`;
    return this.http.get<DocenteResponseListPaginated>(url);
  }

  getAllByFilters(
    filter: DocenteFilter,
    page: number,
    size: number,
  ): Observable<DocenteResponseListPaginated> {
    const url = `${this.baseUrl}/getAllByFilters?page=${page}&size=${size}`;
    return this.http.post<DocenteResponseListPaginated>(url, filter);
  }

  getImagen(id: number) {
    return this.http.get(`${this.baseUrl}/imagen/${id}`, {
      responseType: 'blob',
    });
  }

  delete(documentNumber: string): Observable<DocenteResponse> {
    const url = `${this.baseUrl}/delete?documentNumber=${documentNumber}`;
    return this.http.delete<DocenteResponse>(url);
  }
}
