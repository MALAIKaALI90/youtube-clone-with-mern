import mongoose ,{Schema} from "mongoose";
const likeSchema=new Schema({
videoFile:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    likedBy:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comment:[{
        type: Schema.Types.ObjectId,
        ref: "Coment"
    }],

},{timestamps:true})
export const  Like=mongoose.model("Like",likeSchema) 