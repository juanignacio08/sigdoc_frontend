import { PaginatedResponseDTO } from "../base/paginateddto.model";
import { ResponseDTO } from "../base/responsedto.model";
import { DepartamentoAcademico } from "../maestros/departamentoacademico.model";
import { EscuelaProfesional } from "../maestros/escuelaprofesional.model";
import { TablaMaestra } from "../maestros/tablamaestra.model";
import { Docente } from "./docente.model";
import { Documento, DocumentoRequest } from "./documento.model";

export interface DocenteLaboral {
    docenteLaboralId: number,
    docente: Docente,
    departamentoAcademico: DepartamentoAcademico,
    escuelaProfesional: EscuelaProfesional,
    codigoInstitucional: string,
    emailInstitucional: string,
    codRegimenLaboral: TablaMaestra,
    codCategoriaDocenteNombrado: TablaMaestra,
    codNivelDocenteContratado: TablaMaestra,
    codTiempoDedicacion: TablaMaestra,
    fechaInicio: string,
    fechaFin: string,
    documento: Documento,
    estado: number
}

export interface DocenteLaboralRequest {
    docenteLaboralId: number,
    docenteId: number,
    departamentoId: number,
    escuelaId: number,
    codigoInstitucional?: string,
    emailInstitucional?: string,
    codRegimenLaboral: string,
    codCategoriaDocenteNombrado?: string,
    codNivelDocenteContratado?: string,
    codTiempoDedicacion?: string,
    fechaInicio?: string,
    fechaFin?: string,
    documento?: DocumentoRequest,
    estado: number
}

export type DocenteLaboralResponse = ResponseDTO<DocenteLaboral>;
export type DocenteLaboralListResponse = ResponseDTO<DocenteLaboral[]>;
export type DocenteLaboralResponseListPaginated = PaginatedResponseDTO<DocenteLaboral[]>;

