import express, {Request, Response} from "express";
import {collections} from "../services/database.service";
import User from "../models/user";
import {validateIsAdminMiddleware} from "../middlewares/isAdmin";
const jwt = require("jsonwebtoken");

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post("/login", async (req: Request, res: Response) => {

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


authRouter.post(
    "/",
    validateIsAdminMiddleware,
    async (req: Request, res: Response) => {
        try {
            const newUser = req.body as User;
            const result = await collections.users?.insertOne({...newUser, isAdmin: false});

            result
                ? res
                    .status(201)
                    .send(
                        `Successfully created a student with id ${result.insertedId}`
                    )
                : res.status(500).send("Failed to create a new game.");
        } catch (error) {
            console.error(error);
            res.status(400).send(error instanceof Error ? error.message : "");
        }
    }
);