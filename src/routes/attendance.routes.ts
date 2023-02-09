// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Attendance from "../models/attendance";

// Global Config
export const attendanceRouter = express.Router();

attendanceRouter.use(express.json());

// POST
attendanceRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newAttendance = req.body as Attendance;
    console.log(req);

    const query = { date: new ObjectId(newAttendance.date) };
    const exists = (await collections.attendance?.find(
      query
    )) as unknown as Attendance;

    let result;

    if (exists?.date) {
      result = await collections.attendance?.updateOne(
        { _id: exists?.date },
        {
          $addToSet: {
            sizes: {
              $each: newAttendance.users,
            },
          },
        }
      );

      console.log("if");
    } else {
      result = await collections.attendance?.insertOne(newAttendance);
      console.log("else");
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
});
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
