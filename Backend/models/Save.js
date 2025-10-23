import mongoose from "mongoose";
const SaveSchema = new mongoose.Schema({
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
const Save = mongoose.model("save",SaveSchema);
export default Save;