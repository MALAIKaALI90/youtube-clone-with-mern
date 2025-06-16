    import mongoose,{model, Schema} from "mongoose";
    const playlistSchema=new Schema({
   title:{
    type:String,
    require:true
   },
   discription:{
    type:String,
    require:true

   },
    videos:[{
       type: Schema.Types.ObjectId,
        ref: "Video"
   }],
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
 
},
    },{timestamps:true})
    export const PlayList=mongoose.model("PlayList",playlistSchema)