import { IController } from "./../interfaces/controller";

import { Router, Request, Response } from "express";

export default class Auth implements IController {
    router: Router;
    path: string;
    init(): void {
        throw new Error("Method not implemented.");
    }
    create(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
    index(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }
}
