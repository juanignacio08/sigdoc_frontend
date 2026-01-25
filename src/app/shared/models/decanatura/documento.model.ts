import { ResponseDTO } from "../base/responsedto.model";
import { TablaMaestra } from "../maestros/tablamaestra.model";
import { Docente } from "./docente.model";

export interface Documento {
    documentoId: number,
    denominacion: string,
    codTipoDocumento: string,
    url: string,
    docente: Docente,
    estado: number
}

export type DocumentoResponse = ResponseDTO<Documento>;
export type DocumentoListResponse = ResponseDTO<Documento[]>;

