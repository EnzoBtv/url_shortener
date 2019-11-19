import Express, { Application } from "express";
import Database from "./database";
import { IDatabase } from "./interfaces/database";
import { IServer } from "./interfaces/server";
import { IController } from "./interfaces/controller";

class Server implements IServer {
    app: Application;
    controllers: IController[];
    database: IDatabase;
    constructor(controllers: IController[]) {
        this.controllers = controllers;
        this.app = Express();
    }

    listen() {
        this.app.listen(Number(process.env.PORT), async err => {
            if (err) throw new Error("Não foi possível inicializar o servidor");
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
            await this.initializeDB();

            //@TODO Inicializar as controllers
        });
    }

    private async initializeDB() {
        this.database = new Database(
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            process.env.DB_NAME
        );
        await this.database.initialize();
    }
}

export default Server;
