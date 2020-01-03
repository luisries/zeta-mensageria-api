import { controller, httpPost, httpGet, httpPut, httpDelete, queryParam } from "inversify-express-utils";
import { inject } from "inversify";
import { service } from "../service/_service";
import { MensagemService } from "../service/MensagemService";
import { Request, Response, NextFunction } from "express";
import { Mensagem } from "../entity/Mensagem";


@controller("/mensagens")
export class MensagemController {

    constructor(@inject(service.MensagemService) private mensagemService: MensagemService) {

    }


    @httpPost('/')
    private async inserir(req: Request, res: Response) {
        const notificacao = await this.mensagemService.inserir(req.body);
        res.status(201).send(notificacao);
    }

    @httpGet('/')
    private async listarTodos(req: Request, res: Response, next: NextFunction) {
        let notificacao;
        //Query idUsuario
        if(req.query.idUsuario) { 
            notificacao = await this.mensagemService.listarPorIdUsuario(req.query.idUsuario);       
        }
        //Paginação
        else if(req.query.inicio && req.query.quantidade) {
            notificacao = await this.mensagemService.listarPorPaginacao(req.query.inicio,req.query.quantidade);
        }
        else {
            notificacao = await this.mensagemService.listar();
        }
        console.log("Mensagem",notificacao.id);
        return(notificacao);

    }
    

    @httpPut('/:id')
    private async atualizar(req: Request, res: Response) {
        let notificacaoNovo = Object.assign(new Mensagem(), req.body);
        const notificacao = await this.mensagemService.atualizar(req.params.id, notificacaoNovo);
        res.send(notificacao);
    }

    @httpDelete('/:id')
    private async deletar(req: Request, res: Response) {
        const notificacao = await this.mensagemService.deletar(req.params.id);
        res.send(notificacao);
    }

    @httpGet('/:id')
    private async buscarPorId(req: Request, res: Response) {
        console.log('buscarPorId');
        const notificacao = await this.mensagemService.buscarPorId(req.params.id);
        res.send(notificacao);
    } 
}
