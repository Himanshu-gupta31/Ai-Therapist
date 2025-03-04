import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"//used so that we can access the cookie of the user and also store them in their browser
const app=express();

//For using middleware we you app.use
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(express.json({
    limit:"20kb"
}));//used to tell express that we can allowing to accept json from the user
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}));//used to decode the url 
app.use(cookieParser());

export {app}