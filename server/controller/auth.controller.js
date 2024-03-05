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
        const { password: pass, ...rest } = validUser._doc; // by using ._doc to the validUser it will return all the details except password
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest)


    } catch (error) {
        next(error)
    }

}


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            //if the user exist, user sign in will occur
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)

        } else {
            //if  user does'nt exist, create user new
            // base 36 reperesents : a-z and 0-9

            // const generatedPassword = Math.random().toString(36).slice(-8) // this will give last 8 character passwprds
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // for 16 character password
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)


        }

    } catch (error) {
        next(error)
    }
}
