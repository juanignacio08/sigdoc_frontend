import { ResponseDTO } from "../base/responsedto.model";
import { Facultad } from "./facultad.model";

export interface DepartamentoAcademico {
    departamentoAcademicoId: number,
    denominacion: string,
    abreviatura: string,
    facultad: Facultad,
    estado: number
}

export type DepartamentoAcademicoResponse = ResponseDTO<DepartamentoAcademico>;
export type DepartamentoAcademicoListResponse = ResponseDTO<DepartamentoAcademico[]>;

