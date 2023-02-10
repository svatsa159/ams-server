import {NextFunction, Request, Response} from "express";
const jwt = require("jsonwebtoken");

export const validateUserIdMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey!)?.split(" ")[1];
        const verified = jwt.verify(token, jwtSecretKey);

        if (verified) {
            const userId = verified.userId;
            console.log("Got id : " + userId);
            res.locals.id = userId;
            next();
        } else {
            // Access Denied
            return res.status(401).send();
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
}