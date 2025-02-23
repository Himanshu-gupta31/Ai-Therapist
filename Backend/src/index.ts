import express from "express"
import dotenv from "dotenv"
const app=express();
const PORT=3000;

app.use(express.json())

app.get('/',(req,res) => {
    res.json({"message" : "Hello World"})
})

app.listen(PORT,()=>{
    console.log("App is running at port",PORT)
})


