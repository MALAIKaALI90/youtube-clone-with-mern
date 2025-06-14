import mongoose,{Schema} from "mongoose";
const comentSchema=new Schema({
    content:{
        type:"string"
    },
videoFile:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
      likedBy:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],




},{timestamps:true})
export const Coment=mongoose.model("Coment",comentSchema)