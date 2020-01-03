export interface Service<T>{
    inserir(entidade: T): Promise<T>;
    listar(): Promise<T[]>;
    atualizar(id: number, entidade: T): Promise<T>;
    deletar(id: number): Promise<T>;
    buscarPorId(id: number): Promise<T>;
}
