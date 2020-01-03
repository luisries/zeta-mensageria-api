import { CONFIG_PADRAO, Configuracao } from "./config";
import { EntidadeClienteClarionDTO } from "./dto/EntidadeClienteClarionDTO";
import { injectable } from "inversify";
import { EntidadeFoneClarionDTO } from "./dto/EntidadeFoneClarionDTO";
const axios = require('axios');

//@injectable()
export class EntidadeClienteClarionGateway {
    config: Configuracao;
    options: any;

    constructor(config: Configuracao = CONFIG_PADRAO){
        //Se tiver config
        this.config = config;
        this.options = {
            headers: {
                'Authorization': this.config.authMiddleware,
                'accept': 'application/json'
            }
        };         
    }

    public async inserir(entidadeCliente: EntidadeClienteClarionDTO): Promise<number> {
        //Quebrando os dados - primitivos de clientes e telefones
        let fones = entidadeCliente.fones;
        delete entidadeCliente.fones;

        //Tem que ser depois do delete para remover os fones.
        //Faz o POST para entidades clientes (se inseriu, true)
        //Trabalhos Futuros: ver batchService (Web Client)
        if(await this.inserirDadosCliente(entidadeCliente))
        {
            //Pega o id pelo cpf
            let cliente = await this.buscarPorRegistroFederal(entidadeCliente.cpf_cgc);
            console.log("Codigo-Cliente ",cliente.codcliente);
            if(cliente.codcliente){
                //Altera cada contato com id correto (codentidade) e 
                //insere cada contato no Middleware
                fones.forEach(async fone => {
                    console.log("Fones do Cliente: ",fone);
                    fone.codentidade = cliente.codcliente;
                    this.inserirDadosFone(fone);
                });
                return cliente.codcliente;
            }
        }
        return 0;
    }

    public async inserirDadosCliente(entidadeCliente): Promise<boolean> {
        const entity = "ecli";        

        const apiCliente = this.config.apiMiddleware + "/" + this.config.prefixo + entity+"?body=true";
        console.log("API-Cliente", apiCliente);
        
        //Adicionando o content-type
        this.options.headers['content-type'] = "application/json";

        const response = await axios.post(apiCliente, entidadeCliente, this.options);
        console.log("Response-status: ", response.status);
        console.log("Response-body: ", response.body);

        return (response.status == 201)
    }

    public async inserirDadosFone(fone): Promise<boolean> {
        const entity = "efon";        
        
        const apiFone = this.config.apiMiddleware + "/"+ 
            this.config.prefixo + entity;
        console.log("------------------");
        console.log("API-Fone", apiFone);
        console.log("Fone: ", fone);
        console.log("------------------");
        
        //Adicionando o content-type
        this.options.headers['content-type'] = "application/json";

        const response = await axios.post(apiFone, fone, this.options);
        console.log("Response", response);

        return (response.status == 201)
    }


    public async buscarCliente(cod: number): Promise<EntidadeClienteClarionDTO> {
        console.log("Middleware", this.config.apiMiddleware);
        const apiCliente = this.config.apiMiddleware + "/" + this.config.prefixo + "ecli" + "/" + cod;
        console.log("API", apiCliente);
        const response = await axios.get(apiCliente, this.options);
        const cliente = response.data;

        if (!cliente) return;
        const telefones = await this.listarEntidadeFones(cliente.codcliente);
        return Object.assign(new EntidadeClienteClarionDTO(), 
        {
            codcliente: cliente.codcliente,
            nome: cliente.nome,
            pessoa: cliente.pessoa,
            cpf_cgc: cliente.cpf_cgc,
            datanasc: cliente.datanasc,
            fones: telefones
        });
    }

    public async buscarPorRegistroFederal(registroFederal: string): Promise<EntidadeClienteClarionDTO> {
        const query = "/search?q=SELECT codcliente,nome,pessoa,cpf_cgc,datanasc as dt," +
        "{FN CONVERT({FN TIMESTAMPADD (SQL_TSI_DAY,datanasc-73053, " +
        "{D '2001-01-01'})},SQL_DATE)} as datanasc " +
        "FROM "+this.config.prefixo+"ecli "+
        "WHERE cpf_cgc='" + registroFederal + "'";        
                
        const apiCliente = this.config.apiMiddleware + query;
        console.log("API", apiCliente);
        
        const response = await axios.get(apiCliente, this.options);
        console.log("Response", response.data.resultset.rows[0]);

        if(!response.data.resultset.rows[0])
            return undefined;

        // Se valor de datanasc != 0, pega o valor convertido,
        // Senão, atualiza com 0 (não pega a conversão)
        const dataNasc = response.data.resultset.rows[0][4] 
            ? response.data.resultset.rows[0][5]
            : '0';

        const telefones = await this.listarEntidadeFones(response.data.resultset.rows[0][0]);
        return Object.assign(new EntidadeClienteClarionDTO(),
            {
                codcliente: response.data.resultset.rows[0][0],
                nome: response.data.resultset.rows[0][1],
                pessoa: response.data.resultset.rows[0][2],
                cpf_cgc: response.data.resultset.rows[0][3],
                datanasc: dataNasc,
                fones: telefones
            });
    }

    public async listarEntidadeFones(codigoCliente): Promise<EntidadeFoneClarionDTO[]> {
        let fones:EntidadeFoneClarionDTO[] = [];

        const query = "/search?q=SELECT codfone,codentidade,tipoentidade,tipo,prefixo,numero,preferencial "+
        "FROM "+this.config.prefixo+"efon "+
        "WHERE codentidade=" + codigoCliente +" AND ativo=1";  

        const apiCliente = this.config.apiMiddleware + query;
        console.log("API", apiCliente);

        const response = await axios.get(apiCliente, this.options);
        console.log("Response", response.data.resultset.rows);

        response.data.resultset.rows.forEach(elFone => fones.push(
            Object.assign(new EntidadeFoneClarionDTO(), {
                "codfone": elFone[0],
                "codentidade": elFone[1],
                "tipoentidade": elFone[2],
                "tipo": elFone[3],
                "prefixo": elFone[4],
                "numero": elFone[5],
                "preferencial": elFone[6]
            })
        ));   
        console.log("Fones", fones);
        return fones;
    }
}

