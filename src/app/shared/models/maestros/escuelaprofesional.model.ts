import { ResponseDTO } from "../base/responsedto.model";
import { DepartamentoAcademico } from "./departamentoacademico.model";

export interface EscuelaProfesional {
    escuelaProfesionalId: number,
    denominacion: string,
    abreviatura: string,
    departamentoAcademico: DepartamentoAcademico,
    color: string,
    imagen: string,
    estado: number
}

export type EscuelaProfesionalResponse = ResponseDTO<EscuelaProfesional>;
export type EscuelaProfesionalListResponse = ResponseDTO<EscuelaProfesional[]>;

