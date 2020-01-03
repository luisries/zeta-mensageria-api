import * as jwt from 'jsonwebtoken';
import { inject, injectable } from "inversify";
import { Usuario } from "../entity/Usuario";
import { repository } from "../repository/_repository";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { Service } from './Service';
    

@injectable()
export class UsuarioService implements Service<Usuario>{
    @inject(repository.UsuarioRepository)
    usuarioRepository: UsuarioRepository;

   //Valida autenticação direto no banco
   async validarAutenticacao(username, senha): Promise<Usuario> {
        const usuario = await this.usuarioRepository.buscarPorNome(username);
        if(usuario){
            console.log("Usuario",usuario);
            if(usuario.senha === senha){
                return usuario;
            }
        }
        return undefined;
    }

    gerarToken(usuario: Usuario){
        console.log("Username: ",usuario.nome);
        const token = jwt.sign({_id: usuario.id, usuario: usuario }, 'z&t@_S&cR&T', { expiresIn: '2h' });
        console.log("Token",token);        
        return token;
    }

    
    async inserir(usuario: Usuario): Promise<Usuario> {      
        //this.validator.validaCampos(entidade);
        console.log("Usuario",usuario);
        return this.usuarioRepository.inserir(usuario);
        
    }

    listar(): Promise<Usuario[]> {
        return this.usuarioRepository.listar();
    }

    
    async atualizar(id: number, usuario: Usuario): Promise<Usuario> {
        //this.validator.validaId(id);
        usuario.id = id;
        return this.usuarioRepository.atualizar(usuario);
    }

    async salvar(usuario: Usuario): Promise<Usuario> {
        //Busca o usuário
        const usuarioEncontrado = await this.buscarPorId(usuario.id);
        //Se encontrou, atualiza
        if(usuarioEncontrado){
            console.log("Usuario atualizado: ", usuario.id);
            return await this.usuarioRepository.atualizar(usuario);
        }
        //Senão, insere
        else{
            console.log("Usuario a inserir: ", usuario.nome);
            return await this.usuarioRepository.inserir(usuario);
        }       
    }

    deletar(id: number): Promise<Usuario> {
        //this.validator.validaId(id);
        return this.usuarioRepository.deletar(id);
    }

    buscarPorId(id: number): Promise<Usuario> {
        //this.validator.validaId(id);
        return this.usuarioRepository.buscarPorId(id);
    }
}