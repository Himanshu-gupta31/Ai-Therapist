import express from "express"
import dotenv from "dotenv"
const app=express();
const PORT=3000;
app.listen(PORT,()=>{
    console.log("App is running at poort",PORT)
})


