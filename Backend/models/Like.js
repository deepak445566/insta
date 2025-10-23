import mongoose from "mongoose";
const LikeSchema = new mongoose.Schema({
user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"user",
  required:true
},
item:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"item",
  required:true
}
},{
  timestamps:true
})
const Like = mongoose.model("like",LikeSchema);
export default Like;