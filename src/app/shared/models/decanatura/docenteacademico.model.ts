import { PaginatedResponseDTO } from "../base/paginateddto.model";
import { ResponseDTO } from "../base/responsedto.model";
import { TablaMaestra } from "../maestros/tablamaestra.model";
import { Docente } from "./docente.model";
import { Documento, DocumentoRequest } from "./documento.model";

export interface DocenteAcademico {
    docenteAcademicoId: number,
    docente: Docente,
    codGradoAcademico: TablaMaestra,
    tituloProfesional: string,
    institucionEgreso: string,
    fechaObtencion: string,
    especialidad: string,
    documento: Documento,
    estado: number
}

export interface DocenteAcademicoRequest {
    docenteAcademicoId: number,
    docenteId: number,
    codGradoAcademico: string,
    tituloProfesional: string,
    institucionEgreso: string,
    fechaObtencion?: string,
    especialidad?: string,
    documento?: DocumentoRequest,
    estado?: number
}

export type DocenteAcademicoResponse = ResponseDTO<DocenteAcademico>;
export type DocenteAcademicoListResponse = ResponseDTO<DocenteAcademico[]>;
export type DocenteAcademicoResponseListPaginated = PaginatedResponseDTO<DocenteAcademico[]>;

