//always database connection is write in try catch method 
//and one more thing is think database is always in another contenant so always use async await
import mongoose from "mongoose";

// import { DB_NAME } from "/constant.js";
// import express from "express"
// const app= express()
//ife fuction 
 const MONGODB_URI="mongodb+srv://aimmabibi:yQEBQGcJfRrpvFIR@cluster0.q1yhe0e.mongodb.net"

 const connectDB=(async()=>{
      try {
      await  mongoose.connect(`${MONGODB_URI}/backend`)
      
        
        console.log(" mongodb connected" );
        
        // app.on("error",()=>{
        //     console.log("exprees is not listening",error);
        //     throw err
            
        // })
        // app.listen(process.env.PORT)
    } catch (error) {
        console.log("mongodb connection error",error);
        throw error
        
    }
})()
export default connectDB