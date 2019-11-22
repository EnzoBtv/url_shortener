import { Router, Request, Response } from "express";
import { model, Model } from "mongoose";
import { v4 } from "uuid";

import Logger from "../tools/logger";

import { IController } from "../interfaces/controller";
import { IUrl } from "interfaces/url";

export default class Url implements IController {
    public path: string;
    public router: Router;
    private urlModel: Model<IUrl>;

    constructor() {
        this.path = "/url";
        this.router = Router();
        this.urlModel = model("url");
        this.init();
    }

    private init() {
        this.router.post(this.path, this.create);
    }

    private async create(request: Request, response: Response) {
        try {
            const { url } = request.body;
            let oldUrl = this.urlModel.findOne({
                originalUrl: url
            });
            if (oldUrl) response.status(200).json(oldUrl);
            let newUrl = `https://shUrl.com/${v4()}`;
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
    }
}
