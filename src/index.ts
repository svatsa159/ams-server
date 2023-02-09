import { Express } from "express";
import { connectToDatabase } from "./services/database.service";
import { usersRouter } from "./routes/users.router";
import { attendanceRouter } from "./routes/attendance.routes";
import Attendance from "./models/attendance";

console.log("Hello world");

// Collection : User
//POST - Register user - admin - ok
//GET - All Users - admin - ok
//POST - Login - JWT - insecure - ok
//GET - User by id - secure - ok

// Collection : Attendance
//POST - Mark attendance of user (add, update?)- admin -ok
//GET/:id - Single User's attendance - user specific from token

const express = require("express");

const dotenv = require("dotenv");

const app: Express = express();

// Set up Global configuration access
dotenv.config();

connectToDatabase()
  .then(() => {
    app.use("/users", usersRouter);
    app.use("/attendance", attendanceRouter);

    let PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is up and running on ${PORT} ...`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
