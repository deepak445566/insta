import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  video:{
    type:String,
    required:true
  },
  description:{
    type:String,

  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"owner",
  },
  likeCount:{
    type:Number,
    default:0,

  }, savesCount: {
        type: Number,
        default: 0
    },

}
)
const Item = mongoose.models.item || mongoose.model("item", ItemSchema);
export default Item;