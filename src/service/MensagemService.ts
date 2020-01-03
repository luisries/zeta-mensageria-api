import { Mensagem } from "../entity/Mensagem";
import { MensagemRepository } from "../repository/MensagemRepository";
import { Service } from "./Service";
import { injectable, inject } from "inversify";
import { repository } from "../repository/_repository";

@injectable()
export class MensagemService implements Service<Mensagem>{
    @inject(repository.MensagemRepository)
    repository: MensagemRepository;

    inserir(notificacao: Mensagem): Promise<Mensagem> {
        //this.validator.validaCampos(entidade);
        return this.repository.inserir(notificacao);
    }

    listar(): Promise<Mensagem[]> {
        return this.repository.listar();
    }

    listarPorIdUsuario(idUsuario: number): Promise<Mensagem[]> {
        return this.repository.listarPorIdUsuario(idUsuario);
    }

    listarPorPaginacao(inicio, quant): Promise<Mensagem[]> {
        //validação para o caso inicio > quantidade
        return this.repository.listarPorPaginacao(inicio, quant);
    }

    atualizar(id: number, mensagem: Mensagem): Promise<Mensagem> {
        //this.validator.validaId(id);
        return this.repository.atualizar(mensagem);
    }

    deletar(id: number): Promise<Mensagem> {
        //this.validator.validaId(id);
        return this.repository.deletar(id);
    }
    buscarPorId(id: number): Promise<Mensagem> {
        //this.validator.validaId(id);
        return this.repository.buscarPorId(id);
    }
}