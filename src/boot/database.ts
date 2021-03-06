import { createConnection, Connection } from "mongoose";
import { exec, ExecException } from "child_process";
import { join } from "path";
import logger from "../tools/logger";
import { IDatabase } from "../interfaces/database";

export default class Database implements IDatabase {
    username: string;
    password: string;
    dbName: string;
    connection: Connection;
    constructor(username: string, password: string, dbName: string) {
        this.username = username;
        this.password = password;
        this.dbName = dbName;
    }

    initialize(): Promise<null> {
        return new Promise(async (resolve, reject) => {
            this.connection = createConnection(
                `mongodb+srv://${this.username}:${this.password}@cluster0-lun0k.mongodb.net/${this.dbName}?retryWrites=true&w=majority`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    keepAlive: true
                }
            );
            this.connection.on("open", () => {
                logger.info(
                    `Conectado ao banco de dados na url mongodb+srv://${this.username}/${this.dbName}`
                );
                exec(
                    `ls ${join(__dirname, "..", "models")}`,
                    (error: ExecException, stdout: string, stderr: string) => {
                        if (error || !stdout) {
                            throw new Error(
                                `Houve um erro ao ler as models | ${error ||
                                    stderr}`
                            );
                        }
                        let modelsArray: string[] = stdout.split("\n");

                        modelsArray.forEach(model => {
                            if (!model) return;
                            logger.info(`Inicializando model ${model}`);
                            require(`../models/${model.split(".")[0]}`).default(
                                this.connection
                            );
                        });
                        resolve();
                    }
                );
            });
            this.connection.on("disconnected", () => {
                console.log(
                    "Desconectado do banco de dados, iniciando tentativas de reconexão"
                );
            });
            this.connection.on("close", () => {
                console.log("Conexão com o banco de dados fechada");
                reject();
            });
            this.connection.on("reconnected", () => {
                console.log("Reconectado ao banco de dados");
            });
            this.connection.on("reconnectFailed", () => {
                console.log("Falha ao reconectar com o banco de dados");
            });
            this.connection.on("error", err => {
                console.log("fuck");
                console.log(err);
            });
        });
    }
}
