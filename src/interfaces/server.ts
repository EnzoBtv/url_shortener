import { Application } from "express";

export interface IServer {
    port: number;
    app: Application;
    listen(): any;
}
