import { Application } from "express";

export interface IServer {
    app: Application;
    listen(): any;
}
