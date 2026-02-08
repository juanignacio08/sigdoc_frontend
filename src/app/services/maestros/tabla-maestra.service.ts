import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TablaMaestraListResponse } from '@shared/models/maestros/tablamaestra.model';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablaMaestraService {
  TIPO_DOCUMENTO_IDENTIDAD: string = '001'; // Código para Tipo de Documento
  GENERO: string = '002'; // Código para Tipo de Preferencial
  ESTADO_CIVIL: string = '003'; // Código para Estado de Orden de Atención
  GRADO_ACADEMICO: string = '004'; // Código para Ventanilla
  TIPO_DOCUMENTO = '005';
  IDIOMA = '006';
  NIVEL_IDIOMA = '007';
  REGIMEN_LABORAL = '008';
  CATEGORIA_DOCENTE = '009';
  NIVEL_DOCENTE = '010';
  TIEMPO_DEDICACION = '011';

  DOCENTE_NOMBRADO = '008001';
  DOCENTE_CONTRATADO = '008002';

  COD_DOCUMENTO_IDENTIDAD = '005001';
  COD_GRADO_TITULO = '005002';
  COD_CURRICULUM_VITAE = '005003'
  COD_CERTIFICADO_DIPLOMA = '005004';
  COD_OTRO_DOCUMENTO = '005005';

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + "/master-table";

  getActiveItemsByTable(tableCode: string): Observable<TablaMaestraListResponse> {
    const url = `${this.baseUrl}/getActiveItemsByTable?tableCode=${tableCode}`;
    return this.http.get<TablaMaestraListResponse>(url);
  }
}
