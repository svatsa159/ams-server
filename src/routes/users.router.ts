import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";
import {validateIsAdminMiddleware} from "../middlewares/isAdmin";
import {validateUserIdMiddleware} from "../middlewares/isUser";

export const usersRouter = express.Router();
usersRouter.use(express.json());

// Get all users
usersRouter.get(
  "/all",
  validateIsAdminMiddleware,
  async (_req: Request, res: Response) => {
    try {
      let users = (await collections.users
        ?.find({})
        .toArray()) as unknown as User[];

      res.status(200).send(users.filter(user => !user.isAdmin));
    } catch (error) {
      res.status(500).send(error instanceof Error ? error.message : "");
    }
  }
);

// Get user by id
usersRouter.get(
  "/user",
  validateUserIdMiddleware,
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
