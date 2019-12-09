import { Schema, Connection } from "mongoose";
import { IUser } from "../interfaces/user";
import logger from "../tools/logger";

const User: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: false },
    recovering: { type: Boolean, required: false, default: false }
});

export default async (connection: Connection) => {
    try {
        connection.model<IUser>("user", User);
        logger.info("Model User inicializada");
    } catch (ex) {
        console.log(ex);
    }
};
