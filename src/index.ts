import { config } from "dotenv";
import Server from "./server";

config({
    path: "./.env"
});

new Server([]).listen();
