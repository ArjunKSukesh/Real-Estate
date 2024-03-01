import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

// router is exported as default export in user.routes.js so it name can be changed to be used when importing
import userRouter from './routes/user.routes.js'

const app = express();
mongoose.connect(process.env.MONGO)
.then(() => console.log('connected to db'))
.catch(error => console.log(error))

app.listen(3000, () => {
    console.log('server is running on port : 3000')
})

// after /api/user add /test from userRouter
app.use('/api/user',userRouter);
