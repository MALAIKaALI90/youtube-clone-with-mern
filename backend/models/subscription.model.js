import mongoose,{Schema} from "mongoose";
const subscriptionSchema= new Schema({
subscriber:{
     type: Schema.Types.ObjectId,//one whi is subscribing
        ref: "User"
},
channel:{
       type: Schema.Types.ObjectId,//one to whom subscriber subscribed
        ref: "User"
}




},{timestamps:true});
export const Subscription=mongoose.model("Subscription", subscriptionSchema)