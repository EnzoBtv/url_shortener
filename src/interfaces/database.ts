import { Connection } from "mongoose";
export interface IDatabase {
    username: string;
    password: string;
    dbName: string;
    connection: Connection;
    initialize(): Promise<null>;
}
