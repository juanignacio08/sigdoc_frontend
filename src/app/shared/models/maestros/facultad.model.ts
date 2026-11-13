import { ResponseDTO } from "../base/responsedto.model";

export interface Facultad {
    facultadId: number,
    denominacion: string,
    abreviatura: string,
    estado: number
}

export type FacultadResponse = ResponseDTO<Facultad>;
export type FacultadListResponse = ResponseDTO<Facultad[]>;

