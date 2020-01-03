import { EntidadeFoneClarionDTO } from "./EntidadeFoneClarionDTO";

export class EntidadeClienteClarionDTO {
    codcliente:number;
    nome:string;
    pessoa: string; //"F" ou "J"
    cpf_cgc: string;
    datanasc: string;
    fones: EntidadeFoneClarionDTO[];
    //Manter consistência com Zeta
    uf:string;
    cidade:string;
    situacao: string;
    datacadastramento: string;
    apelidonomefantasia: string;
}