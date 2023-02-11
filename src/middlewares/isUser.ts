import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

export const validateUserIdMiddleware = (
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
      res.locals.id = userId;
      console.log(req?.params?.id)
      if(req?.params?.id !== undefined){
        if(userId !== req?.params?.id){
          res.status(403).send();
        }else{
          next();
        }
      }else{
        next();
      }

    } else {
      // Access Denied
      res.status(401).send();
    }
  } catch (error) {
    // Access Denied
    res.status(401).send(error);
  }
};
