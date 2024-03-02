import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

// router is exported as default export in user.routes.js so it name can be changed to be used when importing
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.route.js'

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO)
.then(() => console.log('connected to db'))
.catch(error => console.log(error))

app.listen(3000, () => {
    console.log('server is running on port : 3000')
})

// after /api/user add /test from userRouter
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter)

//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})