import { ResponseDTO } from "../base/responsedto.model";

export interface Ubigeo {
    codigoUbigeo: string,
    codigoRegion: string,
    denominacionRegion: string,
    codigoProvincia: string,
    denominacionProvincia: string,
    codigoDistrito: string,
    denominacionDistrito: string,
    estado: number
}

export type UbigeoResponse = ResponseDTO<Ubigeo>;
export type UbigeoListResponse = ResponseDTO<Ubigeo[]>;