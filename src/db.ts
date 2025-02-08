import mongoose   from "mongoose";
import { model, Schema } from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/Brainly");
const ObjectId = Schema.Types.ObjectId

export const UserSchema = new Schema({
    username:String,
    password:String,
    email:String
})

const ContentSchema = new Schema({
    title:String,
    link:String,
    tag:[{type:mongoose.Types.ObjectId,ref:"Tag" }],
    userId:{type:ObjectId, ref:"User", required:true}


})

export const UserModel = model("User", UserSchema)
export const ContentModel = model("content", ContentSchema)