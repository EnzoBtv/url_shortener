import logger from "../tools/logger";
import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    logger.warn(
        `Method: ${JSON.stringify(request.method)} | Route: ${request.url}`
    );
    logger.warn(`Body: ${JSON.stringify(request.body)}`);
    logger.warn(`Headers: ${JSON.stringify(request.headers)}`);
    logger.warn(`Params: ${JSON.stringify(request.params)}`);
    next();
};
