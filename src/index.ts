import { Bootstrap } from "./bootstrap";
import { createConnection } from "typeorm";
const boostrap = new Bootstrap();
console.log("Bootstrap construido!");

createConnection().then(async (connection) => {
    console.log("Sistema iniciando ...");

    boostrap.iniciar(connection);
    console.log("Sistema iniciado ...");
    boostrap.executar();
}).catch((err)=> console.log("TypeORM connection error: ", err));