import { ResponseDTO } from "../base/responsedto.model";
import { TablaMaestra } from "../maestros/tablamaestra.model";
import { Ubigeo } from "../maestros/ubigeo.model";

export interface Docente {
    docenteId: number,
    codTipoDocumento: TablaMaestra,
    numDocumento: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    fechaNacimiento: string,
    emailPersonal: string,
    emailInstitucional: string,
    codGenero: TablaMaestra,
    direccion: string,
    codUbigeoActual: Ubigeo,
    codUbigeoProcedencia: Ubigeo,
    codEstadoCivil: TablaMaestra,
    telefono: string,
    fotografia: string,
    estado: number
}

export interface DocenteRequest {
  codTipoDocumento: string,
  numDocumento: string,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  fechaNacimiento ?: string,
  emailPersonal ?: string,
  emailInstitucional ?: string,
  codGenero ?: string,
  direccion ?: string,
  codUbigeoActual ?: string,
  codUbigeoProcedencia ?: string,
  codEstadoCivil ?: string,
  telefono ?: string,
  fotografia ?: string,
  estado : number
}

export type DocenteResponse = ResponseDTO<Docente>;
export type DocenteListResponse = ResponseDTO<Docente[]>;