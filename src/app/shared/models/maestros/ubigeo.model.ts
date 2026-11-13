import { ResponseDTO } from "../base/responsedto.model";

export interface Ubigeo {
    regionId: string,
    region: string,
    provinciaId: string,
    provincia: string,
    ubigeo: string,
    distrito: string
}

export type UbigeoResponse = ResponseDTO<Ubigeo>;
export type UbigeoListResponse = ResponseDTO<Ubigeo[]>;