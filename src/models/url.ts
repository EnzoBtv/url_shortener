import { Schema, Connection } from "mongoose";
import { IUrl } from "../interfaces/url";

const Url: Schema = new Schema({
    originalUrl: { type: String, required: true },
    newUrl: { type: String, required: false }
});

export default (connection: Connection) => connection.model<IUrl>("url", Url);
