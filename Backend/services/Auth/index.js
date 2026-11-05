import express from "express"
import  connectToDb from "./config/db.js"
import dotenv from "dotenv"


dotenv.config()


const port=process.env.PORT



const app=express()

app.use(express.json())
app.use("/",router)



app.listen(port,()=>{
    console.log(`Auth Service Started on Port ${port}`)
    connectToDb()
})