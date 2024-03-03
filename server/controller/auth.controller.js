import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
// import { errorHandler } from "../utils/error.js";


export const signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password)
    const newUser = new User({ username, email, password: hashedPassword })
    try {
        await newUser.save()
        res.status(201).json("user created succesffully")
    } catch (error) {
        // res.status(500).json(error.message)

        // after using middleware 
        next(error)

        //after creating errorHandler function
        // next(errorHandler(550, 'error from the function'))
    }
}


