//always database connection is write in try catch method 
//and one more thing is think database is always in another contenant so always use async await
import mongoose from "mongoose";

// import { DB_NAME } from "/constant.js";
// import express from "express"
// const app= express()
//ife fuction 

// let  MONGODB_URI="mongodb+srv://aimmabibi:yQEBQGcJfRrpvFIR@cluster0.q1yhe0e.mongodb.net"
 const connectDB=(async()=>{
      try {
      await  mongoose.connect(`${process.env. MONGODB_URI
        
      }/${process.env.DB_NAME}`)
        console.log(" mongodb connected" );
        // app.on("error",()=>{
        //     console.log("exprees is not listening",error);
        //     throw err
            
        // })
        // app.listen(process.env.PORT)
    } catch (error) {
        console.log("mongodb connection error in connection ",error);
        throw error
        
    }
})
export  default connectDB