import { PaginatedResponseDTO } from "../base/paginateddto.model";
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

export interface DocenteFilter {
  typeDocument ?: string,
  documentNumber ?: string,
  name ?: string,
  lastName1 ?: string,
  lastName2 ?: string,
  birthdateStart ?: string,
  birthdateEnd ?: string,
  personalEmail ?: string,
  institutionalEmail ?: string,
  gender ?: string,
  ubigeoActual ?: string,
  nivelActual ?: number,
  ubigeoProcedencia ?: string,
  nivelProcedencia ?: number,
  maritalStatus ?: string,
  status ?: number,
  dateCreationStart ?: number,
  dateCreationEnd ?: number

  academicGrade ?: string,
  professionalTitle ?: string,
  academicInstitute ?: string,
  academicSpecialty ?: string

  departmentAcademicId ?: number,
  institutionalCode ?: string,
  workRegimeCode ?: string,
  categoryCode ?: string,
  levelCode ?: string,
  dedicationTime ?: string,
  startDate ?: string,
  endDate ?: string
}

export type DocenteResponse = ResponseDTO<Docente>;
export type DocenteListResponse = ResponseDTO<Docente[]>;
export type DocenteResponseListPaginated = PaginatedResponseDTO<Docente[]>;