import { PrimaryGeneratedColumn, Entity, Unique, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(["nome"])
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    //Username
    @Column()
    nome: string;
    
    @Column()
    senha: string;

    @Column()
    tokenWhats: string;

    @Column()
    empresa: string;

    @Column()
    registroFederal: string;

    @Column()
    email: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}