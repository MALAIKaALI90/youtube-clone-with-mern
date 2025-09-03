import mongoose,{Schema} from "mongoose";
const comentSchema=new Schema({
 content:{
        type:"String",
        require:"true"
    },
videoFile:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
      comentedBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },




},{timestamps:true})
export const Coment=mongoose.model("Coment",comentSchema)