import { IDatabase } from "./interfaces/database";
import { createConnection, Connection } from "mongoose";
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
        return new Promise((resolve, reject) => {
            this.connection = createConnection(
                `mongodb+srv://omniuser:omniuser@cluster0-lun0k.mongodb.net/url_shortener?retryWrites=true&w=majority`,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    keepAlive: true
                }
            );
            this.connection.on("connected", () => {
                console.log(
                    "Conectado ao banco de dados na url mongodb+srv://omniuser:omniuser@cluster0-lun0k.mongodb.net/url_shortener?retryWrites=true&w=majority"
                );
                resolve();
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
        });
    }
}
