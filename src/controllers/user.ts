import { Router, Request, Response } from "express";
import { Model, Connection } from "mongoose";
import { SHA512, enc } from "crypto-js";

import Logger from "../tools/logger";

import { IController } from "../interfaces/controller";
import { IUser } from "interfaces/user";

export default class Url implements IController {
    public path: string;
    public router: Router;
    private userModel: Model<IUser>;

    constructor(connection: Connection) {
        this.path = "/user";
        this.router = Router();
        this.userModel = connection.model("user");
        this.init();
    }

    init() {
        this.router.post(this.path, this.create);
        this.router.get(`${this.path}/:userId`, this.index);
    }

    create = async (request: Request, response: Response) => {
        try {
            let { email, password, name } = request.body;
            if (!email || !password || !name)
                throw new Error(
                    "As informações necessárias não foram enviadas para o cadastro de usuário"
                );
            const oldUser = await this.userModel.findOne({
                email
            });
            if (oldUser)
                throw new Error(
                    "Já existe um usuário cadastrado com esse email"
                );
            password = enc.Base64.stringify(SHA512(password));
            return response.status(200).json(
                await new this.userModel({
                    name,
                    password,
                    email
                }).save()
            );
        } catch (ex) {
            Logger.error(`Erro na criação de usuário | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    };

    index = async (request: Request, response: Response) => {
        try {
            let { userId } = request.params;
            let user = await this.userModel.findById(userId);
            if (!user)
                throw new Error(
                    "Não foi encontrado nenhum usuário com o ID cadastrado"
                );
            return response.status(200).json({ user });
        } catch (ex) {
            Logger.error(`Erro na obtenção de usuário | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    };
}
