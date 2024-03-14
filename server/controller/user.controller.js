import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'
import Listing from "../models/listing.model.js";

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

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });  // new:true is going return and save the updated user with the new info not the previous info 
        // if new:true is not used it will only give previous info for the response

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));

    try {
        await User.findByIdAndDelete(req.params.id);
        // first you need to clear the cookie before the response
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted...');
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            // based on id and when creating userRef id shoud be used as userRef
            const listings = await Listing.find({ userRef: req.user.id });
            // console.log(listing)
            res.status(200).json(listings);
            // console.log(listings)
        } catch (error) {
            next(error)
        }
    }
    else {
        return next(errorHandler(401, 'You can only view your own listings!'))
    }
}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        if (!user) return next(errorHandler(401, 'User not found '))
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
        console.log(rest);
    } catch (error) {
        next(error);
        console.log(error)
    }
}




