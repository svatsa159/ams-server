import {NextFunction, Request, Response} from "express";
const jwt = require("jsonwebtoken");

export const validateIsAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey!)?.split(" ")[1];
        const verified = jwt.verify(token, jwtSecretKey);

        if (verified) {
            const userId = verified.userId;
            console.log("Got id : " + userId);
            const isAdmin = verified.isAdmin;
            console.log("isAdmin: " + isAdmin);
            if (isAdmin) {
                next();
            } else {
                return res.status(401).send();
            }
        } else {
            // Access Denied
            return res.status(401).send();
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
};