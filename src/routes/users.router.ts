// External Dependencies
import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";
import { nextTick } from "process";

// Global Config
export const usersRouter = express.Router();

usersRouter.use(express.json());

const jwt = require("jsonwebtoken");

// Main Code Here //
// Generating JWT
usersRouter.post("/login", async (req: Request, res: Response) => {
  // Validate User Here
  // Then generate JWT Token

  const username = req?.body.username;
  const password = req?.body.password;

  const query = { username: username, password: password };
  const exists = (await collections.users?.findOne(query)) as unknown as User;

  if (exists === null) {
    res.sendStatus(404);
  } else {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: exists._id?.toString(),
      isAdmin: exists.isAdmin,
    };

    const token = jwt.sign(data, jwtSecretKey);
    res.send(token);
  }
});

// Verification of JWT
export const validateIsAdminMiddleware = (
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

// Verification of JWT
function validateUserIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      const isAdmin = verified.isAdmin;
      console.log("isAdmin: " + isAdmin);
      if (!isAdmin) {
        console.log("hi");
        res.locals.id = userId;
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
}

// GET
// Get all users
usersRouter.get(
  "/all",
  validateIsAdminMiddleware,
  async (_req: Request, res: Response) => {
    try {
      let users = (await collections.users
        ?.find({})
        .toArray()) as unknown as User[];

      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : "");
    }
  }
);

// Get - user by id
usersRouter.get(
  "/user",
  [validateUserIdMiddleware],
  async (req: Request, res: Response) => {
    const id = res.locals.id;
    try {
      const query = { _id: new ObjectId(id) };
      const user = (await collections.users?.findOne(query)) as unknown as User;

      if (user) {
        res.status(200).send(user);
      }
    } catch (error) {
      res
        .status(404)
        .send(`Unable to find matching document with id: ${req.params.id}`);
    }
  }
);

// POST
usersRouter.post(
  "/",
  validateIsAdminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const newUser = req.body as User;
      console.log(req);
      const result = await collections.users?.insertOne(newUser);

      result
        ? res
            .status(201)
            .send(
              `Successfully created a new game with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new game.");
    } catch (error) {
      console.error(error);
      res.status(400).send(error instanceof Error ? error.message : "");
    }
  }
);
// PUT
// usersRouter.put("/:id", async (req: Request, res: Response) => {
//   const id = req?.params?.id;

//   try {
//     const updatedUser: User = req.body as unknown as User;
//     const query = { _id: new ObjectId(id) };

//     const result = await collections.users?.updateOne(query, {
//       $set: updatedUser,
//     });

//     result
//       ? res.status(200).send(`Successfully updated game with id ${id}`)
//       : res.status(304).send(`Game with id: ${id} not updated`);
//   } catch (error) {
//     console.error(error instanceof Error ? error.message : "");
//     res.status(400).send(error instanceof Error ? error.message : "");
//   }
// });
// DELETE
