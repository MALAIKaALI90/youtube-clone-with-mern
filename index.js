

import 'dotenv/config';
import connectDB from "./db/connection.js";

config({
    path:"/.env"
})
 connectDB()
 
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running`);
        
    })
})
.catch((err)=>{
    console.log("server is not ruunung",err);
    
})
import {app} from "./app.js"
import { config } from 'dotenv';


































//multer ka use kr k client sy file ly gy  then local server pe temporary rakh dy gy
//next step mai cludanary ka use kr k server sy file ly gy then uplaod  kry gy
//its a production grade setting

// const dotenv=require("dotenv").config({path:"./.en
// A1console.log("A"+1);
//NaN console.log("A"-1);
 //NaNconsole.log("A"*1);
//222 console.log("2"+2+"2");
//20 console.log("2"+2-"2");
// const a={}
//  const b={
//     name:"malaika"
// }
// const d={
//     name:"sheri"
// }
// const c={
// name:"bushra"
// }

// a[b]={


//     name:"fatime"
// }
// a[c]={
//     name:"iqra"
// }
// a[d]={
//     name:"taimoor"
// }
//    console.log(a[b]); the output is taimoor

//yQEBQGcJfRrpvFIR