import { ResponseDTO } from "../base/responsedto.model";

export interface TablaMaestra {
    idTablaMaestra: number;
    codigoTabla: string;
    codigoItem: string;
    codigo: string;
    orden: number;
    abreviatura: string;
    denominacion: string;
    esSistema: number;
    estado: number;
}

export interface TablaMaestraRequest {
    codigoTabla: string;
    codigoItem: string;
    codigo: string;
    orden: number;
    abreviatura: string;
    denominacion: string;
    esSistema: number;
    estado: number;
}

export type TablaMaestraResponse = ResponseDTO<TablaMaestra>;
export type TablaMaestraListResponse = ResponseDTO<TablaMaestra[]>;