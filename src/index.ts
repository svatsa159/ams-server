console.log('Hello world!')

//POST - Register user
//GET - All Users
//POST - Mark attendance of user
//POST - Login - JWT
//GET - Single User's attendance



interface User{
    _id:string,
    username: string,
    name:string,
    dob: string,
    city: string,
    class: string,
    password: string,
    isAdmin: boolean,
}

interface Attendance {
    date: string,
    users: string[] //userId
}