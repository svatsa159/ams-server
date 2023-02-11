import { Express } from "express";
import { connectToDatabase } from "./services/database.service";
import { usersRouter } from "./routes/users.router";
import { attendanceRouter } from "./routes/attendance.routes";
import { authRouter } from "./routes/auth.routes";

console.log("Hello world");

// Collection : Attendance
//POST - Mark attendance of user (add, update?)- admin -ok
//GET/:id - Single User's attendance - user specific from token
const cors = require("cors");
const express = require("express");

const dotenv = require("dotenv");

const app: Express = express();

app.use(cors());

// Set up Global configuration access
dotenv.config();

connectToDatabase()
  .then(() => {
    app.use("/users", usersRouter);
    app.use("/attendance", attendanceRouter);
    app.use("/auth", authRouter);

    let PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is up and running on ${PORT} ...`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
