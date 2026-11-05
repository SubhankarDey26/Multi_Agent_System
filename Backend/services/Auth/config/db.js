import mongoose from "mongoose"

 const conncetToDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Auth Database is Connected")
    }
    catch(error)
    {
        console.log(`Db  error: ${error}`)
    }
}

export default conncetToDb