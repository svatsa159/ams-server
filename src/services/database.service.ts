import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Attendance from "../models/attendance";
import User from "../models/user";

export const collections: {
  users?: mongoDB.Collection<User>;
  attendance?: mongoDB.Collection<Attendance>;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING as string
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const userCollection: mongoDB.Collection<User> = db.collection(
    process.env.USER_COLLECTION as string
  );

  collections.users = userCollection;

  const attendanceCollection: mongoDB.Collection<Attendance> = db.collection(
    process.env.ATTENDANCE_COLLECTION as string
  );

  collections.attendance = attendanceCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName}, collection: ${userCollection.collectionName} and ${attendanceCollection.collectionName}`
  );
}
