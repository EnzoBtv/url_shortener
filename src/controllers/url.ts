import { Router, Request, Response } from "express";

import { Model, Connection } from "mongoose";
import { v4 } from "uuid";

import Logger from "../tools/logger";

import { IControllerRest } from "../interfaces/controller";
import { IUrl } from "interfaces/url";

export default class Url extends IControllerRest {
    public path: string;
    public router: Router;
    private urlModel: Model<IUrl>;

    constructor(connection: Connection) {
        super();
        this.path = "/url";
        this.router = Router();
        this.urlModel = connection.model("url");
        this.init();
    }

    init() {
        this.router.post(this.path, this.create);
        this.router.get(`${this.path}/:id`, this.index);
    }

    create = async (request: Request, response: Response) => {
        try {
            const { url, userId } = request.body;
            let oldUrl: IUrl = await this.urlModel.findOne({
                originalUrl: url,
                userId
            });
            if (oldUrl)
                throw new Error("Você já cadastrou essa URL anteriormente");
            let newUrl: string = `https://shUrl.com/${v4().substring(0, 5)}`;
            return response.status(200).json(
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

    index = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const url = await this.urlModel.findById(id);
            if (!url)
                throw new Error(
                    "Não foi encontrada nenhuma url, por favor, entre em contato com o suporte"
                );
            return response.status(200).json({ url });
        } catch (ex) {
            Logger.error(`Erro no processamento da url | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    };
}
