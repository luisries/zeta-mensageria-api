import {EntityRepository, Repository, EntityManager, DeepPartial} from "typeorm";

export class CRUDGenericRepository<T> extends Repository<T>
{   
    public inserir(entidade: DeepPartial<T>):Promise<T>{
        return(this.salvar(entidade));        
    }
    
    public atualizar(entidade: DeepPartial<T>):Promise<T>{
        return(this.salvar(entidade));
    }

    public inserirOuAtualizar(entidade: DeepPartial<T>):Promise<T>{
        return(this.salvar(entidade));
    }

    private salvar(entidade: DeepPartial<T>):Promise<T>{
        const entidadeCriada = this.create(entidade);
        const entidadeNova = this.manager.save(entidadeCriada);
        return (entidadeNova);
    }

    public listar():Promise<T[]>{
        return this.find();        
    }

    public listarPorPaginacao(inicio, quantidade):Promise<T[]>{
        return this.find({skip:inicio,take:quantidade});        
    }

    public buscarPorId(id: number):Promise<T>{
        return this.findOne(id);                
    }

    public deletar(id: number):Promise<T>{
        return this.findOne(id).then(
            entidadeRemover => this.remove(entidadeRemover)
        );
    }

}