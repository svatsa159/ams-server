// External Dependencies
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Attendance from "../models/attendance";
import { validateIsAdminMiddleware } from "../middlewares/isAdmin";

// Global Config
export const attendanceRouter = express.Router();

attendanceRouter.use(express.json());

// POST
attendanceRouter.post(
  "/",
  validateIsAdminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const newAttendance = req.body as Attendance;

      const query = { date: newAttendance.date };
      const exists = (await collections.attendance?.findOne(
        query
      )) as unknown as Attendance;
      let result;
      if (exists?.date === null || exists?.date === undefined) {
        result = await collections.attendance?.insertOne(newAttendance);
      } else {
        let currentUsers = exists?.users;
        result = await collections.attendance?.updateOne(
          { date: newAttendance?.date },
          {
            $push: {
              users: {
                $each: newAttendance?.users
                  .filter((i) => !currentUsers.includes(i))
                  .map((i) => i.toString()),
              },
            },
          }
        );
      }
      result
        ? res
            .status(201)
            .send(`Successfully created new attendace with id ${result}`)
        : res.status(500).send("Failed to create a new attendance.");
    } catch (error) {
      console.error(error);
      res.status(400).send(error instanceof Error ? error.message : "");
    }
  }
);

// Get attendace by id
attendanceRouter.get(
  "/:id",
  validateIsAdminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = req?.params?.id;
      console.log(id);
      const exists: Attendance[] = (await collections.attendance
        ?.find({ users: { $elemMatch: { $eq: id.toString() } } })
        .toArray())!;

      console.log(exists);
      res.send(exists.map((e) => e.date));
    } catch (error) {
      res
        .status(404)
        .send(`Unable to find matching document with id: ${req.params.id}`);
      console.log(error);
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
