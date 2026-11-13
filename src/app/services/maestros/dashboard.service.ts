import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardResponse } from '@shared/models/maestros/dashboard.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + "/dashboard";

  getMain() : Observable<DashboardResponse> {
    const url = `${this.baseUrl}/getMain`;
    return this.http.get<DashboardResponse>(url);
  }

}
