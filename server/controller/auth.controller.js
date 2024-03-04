import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
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


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //for checking email is valid 
        const validUser = await User.findOne({ email }) // actually it should email:email but both have same name so it only require one name
        if (!validUser) return next(errorHandler(404, 'User not found'))
        // passowrd is compared with password in the database using bcryptjs.compareSync
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(404, 'wrong credentials!'))
        //cookie
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const{password :pass, ...rest} = validUser._doc; // by using ._doc to the validUser it will return all the details except password
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest)


    } catch (error) {
        next(error)
    }

}

