import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'

export const test = (req, res) => {
    res.json({
        message: "api route is working"
    })
}

export const updateUser = async (req, res, next) => {
    // if the is not the same as the id we get from params
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'you can only update your own account'));

    // if user is correct we want to update the user
    try {

        //if the user wanted to update 
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password); //password should br hashed before update
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set :{
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar
            }
        },{new:true});  // new:true is going return and save the updated user with the new info not the previous info 
        // if new:true is not used it will only give previous info for the response

        const{password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

};