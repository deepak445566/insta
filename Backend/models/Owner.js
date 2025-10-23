import mongoose from "mongoose";
const OwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactname:{
      type:String,
required:true
    },
    phone:{
      type:String,
      required:true
    },
    address:{
      type:String,
      required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Owner = mongoose.models.owner || mongoose.model("owner", OwnerSchema);
export default Owner;
