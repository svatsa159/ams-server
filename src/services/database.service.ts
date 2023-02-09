// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
export const collections: {
  users?: mongoDB.Collection;
  attendance?: mongoDB.Collection;
} = {};
secret: process.env.DB_CONN_STRING as string;

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING as string
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const userCollection: mongoDB.Collection = db.collection(
    process.env.USER_COLLECTION as string
  );

  collections.users = userCollection;

  const attendanceCollection: mongoDB.Collection = db.collection(
    process.env.ATTENDANCE_COLLECTION as string
  );

  collections.attendance = attendanceCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName}, collection: ${userCollection.collectionName} and ${attendanceCollection.collectionName}`
  );
}
