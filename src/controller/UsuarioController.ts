import { controller, httpPost, httpGet, httpPut, httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import { service } from "../service/_service";
import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import { Usuario } from "../entity/Usuario";

@controller("/usuarios")
export class UsuarioController {

    constructor(@inject(service.UsuarioService) private usuarioService: UsuarioService) {
    }

    @httpPost('/')
    private async inserir(req: Request, res: Response) {
        try{
            console.log("req", req);
            console.log("Body", req.body);
            const cliente = await this.usuarioService.inserir(req.body);
            res.status(201).send(cliente);
        }
        catch(error){
            console.log("Erro: ",error.message);
            res.status(500).json({message: error.message});
        }
    }

    @httpGet('/')
    private async listarTodos(req: Request, res: Response) {
        console.log("Listando Usuários");
        const cliente = await this.usuarioService.listar();
        res.send(cliente);
    }

    @httpPut('/:id')
    private async atualizar(req: Request, res: Response) {
        let usuarioNovo = Object.assign(new Usuario(), req.body);
        const usuario = await this.usuarioService.atualizar(req.params.id, usuarioNovo);
        res.send(usuario);
    }

   /* @httpPut('/:id/senha')
    private async atualizarSenha(req: Request, res: Response) {
        const usuarioAtualizar = Object.assign(new Usuario(), req.body);
        console.log('Usuario', usuarioAtualizar);
        console.log('Senha Atual', req.body.senhaAtual);
        console.log('Senha Nova', req.body.senhaNova);
        try {
            const usuario = await this.usuarioService.buscarPorNome(req.body.username);
            if (usuario) {
                this.usuarioService.atualizarSenha(usuario, req.body.senhaAtual, req.body.senhaNova);

            } else {
                res.status(500).json({msg: 'Usuário não encontrado' });
            }
        } catch (err) {
            res.status(500).json({msg: err});
        }
    }*/

    @httpDelete('/:id')
    private async deletar(req: Request, res: Response) {
        const usuario = await this.usuarioService.deletar(req.params.id);
        res.send(usuario);
    }

    @httpGet('/:id')
    private async buscarPorId(req: Request, res: Response) {
        console.log('buscarPorId');
        const usuario = await this.usuarioService.buscarPorId(req.params.id);
        res.send(usuario);
    }
    
}