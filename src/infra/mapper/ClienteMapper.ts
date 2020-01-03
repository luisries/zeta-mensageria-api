import { IMapper } from "./IMapper";
import { EntidadeClienteClarionDTO } from "../clarion/dto/EntidadeClienteClarionDTO";
import { Cliente } from "../../entity/Cliente";
import { EntidadeFoneClarionDTO } from "../clarion/dto/EntidadeFoneClarionDTO";

export class ClienteMapper implements IMapper<Cliente, EntidadeClienteClarionDTO>{
    
    toTarget(source: Cliente,convertData=false): EntidadeClienteClarionDTO {      
        if (!source) return null;

        let fones:EntidadeFoneClarionDTO[] = [];

        if(source.telefone){
            fones.push(
                Object.assign(new EntidadeFoneClarionDTO(), {
                    "codentidade": source.zetaId,     
                    "tipoentidade": 'C',
                    "tipo": 'Celular',
                    "prefixo": '',
                    "numero": source.telefone,
                    "preferencial": 1,
                    "ativo": 1
                })
            );
        }

        if(source.email){
            fones.push(
                Object.assign(new EntidadeFoneClarionDTO(), {
                    "codentidade": source.zetaId,     
                    "tipoentidade": 'C',
                    "tipo": 'E-mail',
                    "prefixo": '',
                    "numero": source.email,
                    "preferencial": 1,
                    "ativo": 1
                })
            );
        }

        const dmy = source.dataNascimento.split("/");
        let dataNascE: any = dmy[2]+'-'+dmy[1]+'-'+dmy[0];  
        
        let today: Date = new Date();
        let dataToday: any = today.toISOString();
        
        //Se tiver convertData, ele converte a data para o número calculado
        if(convertData)
        {
            let diff = new Date(dataNascE).getTime() - new Date('2001-01-01').getTime();
            dataNascE = Math.floor(diff/1000/60/60/24)+ 73053;   
            
            let diffToday = today.getTime() - new Date('2001-01-01').getTime();
            dataToday = Math.floor(diffToday/1000/60/60/24)+ 73053;   
        }

        return Object.assign(new EntidadeClienteClarionDTO(), {
            codcliente: source.zetaId,
            nome: source.nome,
            pessoa: source.registroFederal && (source.registroFederal.replace(/[^\d]+/g,'').length <= 11) ?"F" :"J",
            cpf_cgc: source.registroFederal, 
            datanasc: dataNascE,
            fones: fones,
            //Adicionei estaticamente para consistência com Zeta
            uf: "SP",
            cidade: "Ribeirão Preto",
            situacao: "N",
            datacadastramento: dataToday,
            apelidonomefantasia: source.nome
        });
    }
        
    toSource(target: EntidadeClienteClarionDTO): Cliente {
        if(!target) return null;        

        const telefoneC = target.fones.find((elem)=> {
            console.log(elem);
            return(elem.preferencial == 1 && elem.ativo == 1 
                && (elem.tipo=="Celular" || elem.tipo=="Residencial" 
                || elem.tipo=="Comercial"));
        });

        const emailC = target.fones.find((elem)=> {
            return(elem.preferencial == 1 && elem.ativo == 1 
                && (elem.tipo=="Email"));
        });


        const dmy = target.datanasc.split("-");
        const dataNascimentoC = target.datanasc != '0'
            ?dmy[2]+'/'+dmy[1]+'/'+dmy[0]
            :'0';

        return(Object.assign(new Cliente(),{
            id: null,
            zetaId: target.codcliente,
            registroFederal: target.cpf_cgc,
            nome: target.nome,
            email: emailC ?emailC.numero :"",
            telefone: telefoneC ?telefoneC.numero :"",
            dataNascimento: dataNascimentoC
        }));
    }
}