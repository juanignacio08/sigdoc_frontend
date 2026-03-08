import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UbigeoListResponse, UbigeoResponse } from '@shared/models/maestros/ubigeo.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  http = inject(HttpClient);
  
  private readonly baseUrl = environment.apiUrl + "/ubigeo";
  
  getDepartments(): Observable<UbigeoListResponse> {
    const url = `${this.baseUrl}/getDepartamentos`;
    return this.http.get<UbigeoListResponse>(url);
  }

  getProvinces(departmentCode : string) : Observable<UbigeoListResponse> {
    const url = `${this.baseUrl}/getProvincias?departamentCode=${departmentCode}`;
    return this.http.get<UbigeoListResponse>(url);
  }

  getDistricts(departmentCode : string, provinceCode : string) : Observable<UbigeoListResponse> {
    const url = `${this.baseUrl}/getDistritos?departamentCode=${departmentCode}&provinceCode=${provinceCode}`;
    return this.http.get<UbigeoListResponse>(url);
  }

  getUbigeoDetail(ubigeoCode : string) : Observable<UbigeoResponse> {
    const url = `${this.baseUrl}/getDetail?code=${ubigeoCode}`;
    return this.http.get<UbigeoResponse>(url);
  }
}
