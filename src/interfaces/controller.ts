import { Router, Request, Response } from "express";

export interface IController {
    router: Router;
    path: string;
    init(): void;
    create(request: Request, response: Response): Promise<Response>;
    index(request: Request, response: Response): Promise<Response>;
}
