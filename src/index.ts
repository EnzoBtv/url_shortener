import { config } from "dotenv";
import { join } from "path";
import Server from "./server";

config({
    path: join(__dirname, "..", "src", ".env")
});
console.log(process.env);

new Server([]).listen();
