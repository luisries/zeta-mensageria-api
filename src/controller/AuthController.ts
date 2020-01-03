import { controller, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import { service } from "../service/_service";
import { inject } from "inversify";


@controller('')
export class AuthController {
    @inject(service.UsuarioService)
    private usuarioService: UsuarioService;

    @httpPost('/token')
    private async autenticar(req: Request, res: Response) {

        console.log("Autenticar!");
        try {
            //Valida o cliente buscando o registro no Middleware - retorna entidade Cliente
            const usuarioLogado = await this.usuarioService.validarAutenticacao(req.body.usuario,req.body.senha);
            //Se login com sucesso
            if (usuarioLogado) {
                //gera Token
                const token = this.usuarioService.gerarToken(usuarioLogado);
                console.log(token);
                res.status(201).json({
                    auth: true,
                    usuario: usuarioLogado,
                    expiresIn: '3600',
                    token: token
                });
            } else {
                res.status(401).json({ auth: false, message: 'Unauthorized' });
            }
        } catch (err) {
            res.status(500).json({ auth: false, message: err });
        }
    }
}