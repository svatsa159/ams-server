import { ObjectId } from "mongodb";

export default class User {
  constructor(
    public name: string,
    public username: number,
    public dob: string,
    public city: string,
    public course: string,
    public password: string,
    public isAdmin: boolean,
    public _id?: ObjectId
  ) {}
}
