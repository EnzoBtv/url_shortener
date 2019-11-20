import logger from "../tools/logger";
import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    logger.debug(`Method: ${request.method} | Route: ${request.url}`);
    next();
};
