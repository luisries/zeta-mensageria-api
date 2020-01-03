import { EntityRepository } from "typeorm";

import { injectable } from "inversify";

import { CRUDGenericRepository } from "./CRUDGenericRepository";
import { Usuario } from "../entity/Usuario";

@EntityRepository(Usuario)
@injectable()
export class UsuarioRepository extends CRUDGenericRepository<Usuario> {

    public buscarPorNome(nome: string): Promise<Usuario> {
        console.log("Buscar - UsuarioRepository");
        return this.createQueryBuilder("usuario")
            .where("usuario.nome = :nome", {nome})
            .getOne();
    }

}