import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";
import AuthRoute from "./Routes/AuthRoute.js"
import UserRoute from "./Routes/UserRoute.js"
import postRoute from "./Routes/postRoute.js"

//routes



const app = express()
//middle ware

app.use(bodyParser.json({limit:"30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb" , extended:true}));
app.use(cors())


//to hide confidential information like db details,port, calling env file
dotenv.config()

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser :true, 
    useUnifiedTopology:true
})
.then(() => app.listen(process.env.PORT, () => console.log(`listening at port ${process.env.PORT}`)))
.catch((error) => 
    console.log(error));


    //usage of routes

    app.use('/auth' , AuthRoute)
    app.use('/user' , UserRoute)
    app.use('/post', postRoute)











    //notes: bcrypt is used to hide the password in mongodb ,this package will encrypt password