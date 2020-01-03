import "reflect-metadata"
import bodyParser = require("body-parser");
import * as path from "path";
import * as express from "express";
import { Connection } from "typeorm";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { repository } from "./repository/_repository";
import { UsuarioRepository } from "./repository/UsuarioRepository";
import { MensagemRepository } from "./repository/MensagemRepository";
import { service } from "./service/_service";
import { UsuarioService } from "./service/UsuarioService";
import { MensagemService } from "./service/MensagemService";
import "./controller/_controller";

export class Bootstrap{
    private container: Container;
    private server: InversifyExpressServer;
    private serverApp: any;

    constructor() {
        this.container = new Container();
    }

    public iniciar(conexao: Connection) {
        //console.log("OK0");
        this.iniciarConexao(conexao);
        //console.log("OK1");
        this.iniciarInject();
        //console.log("OK2");
        this.iniciarServer();
        //console.log("OK3");
    }

    private iniciarConexao(conexao: Connection) {
        const usuarioRepository = conexao.getCustomRepository(UsuarioRepository);
        this.container.bind<UsuarioRepository>(repository.UsuarioRepository).toConstantValue(usuarioRepository);

        const mensagemRepository = conexao.getCustomRepository(MensagemRepository);
        this.container.bind<MensagemRepository>(repository.MensagemRepository).toConstantValue(mensagemRepository);
    }

    private iniciarInject() {
        //Gateways
        //this.container.bind<EntidadeClienteClarionGateway>(gateway.EntidadeClienteClarionGateway).to(EntidadeClienteClarionGateway);

        //Services
        this.container.bind<MensagemService>(service.MensagemService).to(MensagemService);
        this.container.bind<UsuarioService>(service.UsuarioService).to(UsuarioService);
    }

    private iniciarServer() {
        this.server = new InversifyExpressServer(this.container, null, { rootPath: "/api/v1" });
        const currentWorkingDirectory = process.cwd();

        this.server.setConfig((app) => {


            const cors = require('cors');
            app.use(cors());
            app.options('*', cors());

            // add body parser
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            app.use(bodyParser.json());


            const publicPath = path.join(currentWorkingDirectory, "./dist/public");
            console.log("currentWorkingDirectory: " + JSON.stringify(currentWorkingDirectory));
            console.log("Public path: " + JSON.stringify(publicPath));

            app.use(express.static(publicPath));
			//app.use('/esteticar', express.static(publicPath));
			//app.use('/main', express.static(publicPath));
			//app.use("/*",express.static('public'));
        });


        this.trataErros();
        this.serverApp = this.server.build();

    }

    private trataErros() {
        this.server.setErrorConfig((app) => {
            app.use((err, req, res, next) => {
                console.error(err.stack);
                res.status(500).send(JSON.parse('{"error":"' + err.message + '"}'));

            });
        });
    }

    public executar() {
        this.serverApp.listen(8000, () => {
            console.log("Servidor executando na porta 8000");
        });


        /*
        		const options = {
			pfx: fs.readFileSync('cert.pfx'),
			passphrase: 'zeta@123'
		};
		const PORT_HTTP = process.env.PORT_HTTP || 8030
		const PORT_HTTPS = process.env.PORT_HTTPS || 443

		// create the http server
		const httpServer = http.createServer(this.serverApp);
		// create the https server
		const httpsServer = https.createServer(options, this.serverApp);

		httpServer.listen(PORT_HTTP);
        httpsServer.listen(PORT_HTTPS);
        */
    }
}