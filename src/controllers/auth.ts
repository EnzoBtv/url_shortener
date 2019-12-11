import { Router, Request, Response } from "express";
import { Connection, Model } from "mongoose";
import { enc, SHA512 } from "crypto-js";
import { sign } from "jsonwebtoken";
import { v4 } from "uuid";
import { IUser } from "interfaces/user";

import Logger from "../tools/logger";
import Mailer from "../tools/email";
import { IController } from "../interfaces/controller";

export default class Auth extends IController {
    router: Router;
    path: string;
    userModel: Model<IUser>;

    constructor(connection: Connection) {
        super();
        this.path = "/auth";
        this.router = Router();
        this.userModel = connection.model("user");
        this.init();
    }

    init = (): void => {
        this.router.post(this.path, this.login);
    };

    async login(request: Request, response: Response): Promise<Response> {
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
            user.recovering = undefined;
            user.save();
            return response.status(200).json({ token });
        } catch (ex) {
            Logger.error(`Erro no login| Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    }

    async recoverPassword(request: Request, response: Response) {
        try {
            const { email } = request.body;
            let recoveryUser = await this.userModel.findOneAndUpdate(
                { email },
                {
                    recovering: v4()
                }
            );
            if (!recoveryUser)
                throw new Error(
                    "Não foi encontrado nenhum usuário com esse email"
                );
            let mailSender = new Mailer(
                email,
                "Recuperação de Senha Encurtador de URL",
                `Para acessar sua plataforma no E-Login acesse essa url e redefina sua senha: ${"url"}`, // htps://dominio/token/<userId>
                null
            );
            await mailSender.send();
            return response.status(200).json({
                success: true
            });
        } catch (ex) {
            Logger.error(`Erro na recuperação de senha | Erro: ${ex.message}`);
            response.status(500).json({ error: ex.message });
        }
    }
}
