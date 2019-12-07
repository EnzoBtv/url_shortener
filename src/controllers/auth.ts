import { Router, Request, Response } from "express";
import { Connection, Model } from "mongoose";
import { enc, SHA512 } from "crypto-js";
import { sign } from "jsonwebtoken";
import { IUser } from "interfaces/user";

import Logger from "../tools/logger";

export default class Auth {
    router: Router;
    path: string;
    userModel: Model<IUser>;

    constructor(connection: Connection) {
        this.path = "/auth";
        this.router = Router();
        this.userModel = connection.model("user");
        this.init();
    }

    init = (): void => {
        this.router.post(this.path, this.login);
    };

    login = async (request: Request, response: Response): Promise<Response> => {
        try {
            const { email, password } = request.body;
            let user = await this.userModel.findOne({ email });
            if (!user)
                throw new Error(
                    "Não existe nenhum usuário cadastrado no sistema com o email especificado."
                );
            if (enc.Base64.stringify(SHA512(password)) !== user.password)
                throw new Error(
                    "A senha inserida para o login está incorreta, por favor, tente novamente"
                );
            let token = sign(
                {
                    userId: user._id
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 36000
                }
            );
            user.token = token;
            user.save();
            return response.status(200).json({ token });
        } catch (ex) {
            Logger.error(`Erro no login| Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    };

    recoverPassword(request: Request, response: Response) {
        try {
        } catch (ex) {
            Logger.error(`Erro na recuperação de senha | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    }
}
