import { Router, Request, Response } from "express";

import { Model, Connection } from "mongoose";
import { v4 } from "uuid";

import Logger from "../tools/logger";

import { IController } from "../interfaces/controller";
import { IUrl } from "interfaces/url";

export default class Url implements IController {
    public path: string;
    public router: Router;
    private urlModel: Model<IUrl>;

    constructor(connection: Connection) {
        this.path = "/url";
        this.router = Router();
        this.urlModel = connection.model("url");
        this.init();
    }

    private init() {
        this.router.post(this.path, this.create);
    }

    private create = async (request: Request, response: Response) => {
        try {
            const { url } = request.body;
            let oldUrl = await this.urlModel.findOne();
            if (oldUrl) response.status(200).json(oldUrl);
            let newUrl = `https://shUrl.com/${v4().substring(0, 5)}`;
            response.status(200).json(
                await new this.urlModel({
                    originalUrl: url,
                    newUrl
                }).save()
            );
        } catch (ex) {
            Logger.error(`Erro no processamento da url | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    };
}
