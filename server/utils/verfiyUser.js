import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    // if there is no token
    if(!token) return next(errorHandler(401, 'unauthorized'));

    // if there is a token we need to check the token is correct or not
    jwt.verify(token, process.env.JWT_SECRET,(err, user)=>{

        // if there is error 
        if(err) return next(errorHandler(403, 'forbidden'));

        // if there is no error it is send to next()
        // user is from cookie. Actually user is just an id of the user but it is saved as user
        // user is not a user data
        req.user = user;
        next();
    });
};
