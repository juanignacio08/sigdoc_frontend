import { PaginatedResponseDTO } from "../base/paginateddto.model";
import { ResponseDTO } from "../base/responsedto.model";
import { TablaMaestra } from "../maestros/tablamaestra.model";
import { Docente } from "./docente.model";
import { Documento, DocumentoRequest } from "./documento.model";

export interface ExperienciaProfesional {
    experienciaProfesionalId: number,
    docente: Docente,
    empresa: string,
    cargo: string,
    descripcion: string,
    fechaInicio: string,
    fechaFin: string,
    documento: Documento,
    estado: number
}

export interface ExperienciaProfesionalRequest {
    experienciaProfesionalId: number,
    docenteId: number,
    empresa: string,
    cargo: string,
    descripcion?: string,
    fechaInicio?: string,
    fechaFin?: string,
    documento?: DocumentoRequest,
    estado: number
}

export type ExperienciaProfesionalResponse = ResponseDTO<ExperienciaProfesional>;
export type ExperienciaProfesionalListResponse = ResponseDTO<ExperienciaProfesional[]>;
export type ExperienciaProfesionalResponseListPaginated = PaginatedResponseDTO<ExperienciaProfesional[]>;
