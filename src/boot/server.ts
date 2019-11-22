import Express, { Application } from "express";
import cors from "cors";
import { urlencoded, json } from "body-parser";
import { exec, ExecException } from "child_process";
import { join } from "path";

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
    constructor() {
        this.app = Express();
    }

    listen() {
        this.app.listen(Number(process.env.PORT), async err => {
            if (err) throw new Error("Não foi possível inicializar o servidor");
            logger.info(`Servidor rodando na porta ${process.env.PORT}`);
            await this.initializeDB();
            this.initializeMiddlewares();
            this.initializeControllers();
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
        this.app.use(cors());
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json());
        this.app.use(expressLogger);
    }

    private initializeControllers() {
        exec(
            `ls ${join(__dirname, "..", "controllers")}`,
            (error: ExecException, stdout: string, stderr: string) => {
                if (error || !stdout) {
                    throw new Error(
                        `Houve um erro ao ler as models | ${error || stderr}`
                    );
                }
                let controllersArray: string[] = stdout.split("\n");
                for (let controller of controllersArray) {
                    if (controller) {
                        let objController = require(`../controllers/${
                            controller.split(".")[0]
                        }`);
                        this.app.use(
                            "/",
                            new objController.default(this.database.connection)
                                .router
                        );
                    }
                }
            }
        );
    }
}

export default Server;
