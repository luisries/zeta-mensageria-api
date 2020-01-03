import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Mensagem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texto: string;

    @Column()
    destinatario: string;

    @ManyToOne(type => Usuario)
    remetente: Usuario;

    @Column()
    ativo: boolean;

    @Column()
    enviada: boolean;

    @Column({nullable: true})
    erro: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    constructor(){
        this.enviada = true;
        this.ativo = true;
    }
}