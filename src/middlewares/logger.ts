import logger from "../tools/logger";
import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    logger.warn(`Method: ${request.method} | Route: ${request.url}`);
    logger.warn(`Body: ${request.body}`);
    logger.warn(`Headers: ${request.headers}`);
    logger.warn(`Params: ${request.params}`);
    next();
};
