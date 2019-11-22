import { Schema, Connection, model } from "mongoose";
import { IUrl } from "../interfaces/url";
import logger from "../tools/logger";

const Url: Schema = new Schema({
    originalUrl: { type: String, required: true },
    newUrl: { type: String, required: false }
});

export default async (connection: Connection) => {
    try {
        connection.model<IUrl>("url", Url);
        logger.info("Model URL inicializada");
    } catch (ex) {
        console.log(ex);
    }
};
