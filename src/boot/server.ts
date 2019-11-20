import Express, { Application } from "express";

import Database from "./database";

import logger from "../tools/logger";

import expressLogger from "../middlewares/logger";

import { IDatabase } from "../interfaces/database";
import { IServer } from "../interfaces/server";
import { IController } from "../interfaces/controller";

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
            logger.info(`Servidor rodando na porta ${process.env.PORT}`);
            await this.initializeDB();
            this.initializeMiddlewares();
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

    private initializeMiddlewares() {
        this.app.use(expressLogger);
    }
}

export default Server;
