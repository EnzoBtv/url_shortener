import { Router, Request, Response } from "express";

export class IController {
    init() {}
    router: Router;
    path: string;
}

export class IControllerRest extends IController {
    create(request: Request, response: Response) {}
    index(request: Request, response: Response) {}
}
