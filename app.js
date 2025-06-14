import express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";
const app=express();
//ap.use mainly use fr stup middleware
app.use(cors({
    origin:{
        path:"*",
        credential:true}    
}))
app.use(express.json({limit:"16kb"}))
//if data come from URL THEN

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
//routess
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import comentRouter from "./routes/comment.routes.js"
//routess declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/coments",comentRouter)

export {app}
