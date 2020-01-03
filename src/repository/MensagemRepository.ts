import { EntityRepository } from "typeorm";
import { injectable } from "inversify";
import { CRUDGenericRepository } from "./CRUDGenericRepository";
import { Mensagem } from "../entity/Mensagem";

@EntityRepository(Mensagem)
@injectable()
export class MensagemRepository extends CRUDGenericRepository<Mensagem> {

    public listar():Promise<Mensagem[]>{
        return this.find({where:{ativo:true}});        
    }

    public listarPorPaginacao(inicio, quantidade):Promise<Mensagem[]>{
        return this.find({where:{ativo:true},skip:inicio,take:quantidade});        
    }

    public listarPorIdUsuario(id):Promise<Mensagem[]>{
        console.log("listarPorUsuario");
        return this.find({
            select: ["id","texto","enviada","ativo"],
            where:{ativo:true, remetente:{id:id}}
            //relations: ["remetente"], --> Assim busca só os dados.
        });        
    }

}