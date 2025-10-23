
import Owner from "../models/Owner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




const generateToken = (ownerId) => {
  const payload = {id: ownerId }; // ✅ Fixed: payload should be an object
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // ✅ Added expiration
};

export const registerOwner = async (req, res) => {
  try {
    
    const {name,email,password,phone,address,contactname}= req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({
        success: false,
        message: "Owner already exists",
      });
    }

const hashedPassword = await bcrypt.hash(password,10);
 const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactname
    });

 const token = generateToken(owner._id.toString());
    res.cookie("token", token)
   res.status(201).json({
    message:"Owner Registered successfully",
    user:{
      _id:owner._id,
      email:owner.email,
      name:owner.name,
address:owner.address,
contactname:owner.contactname,
phone:owner.phone,
    }
   })



  } catch (error) {
      console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const loginOwner = async (req,res)=>{
  try {
      const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
     const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }


    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

   
    const token = generateToken(owner._id.toString());
    res.cookie("token", token)
   res.status(200).json({
    message:"Owner loggin successfully",
    user:{
      _id:owner._id,
      email:owner.email,
      name:owner.name
    }
   })



  } catch (error) {
     console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const logoutOwner = (req,res)=>{
  res.clearCookie("token");
  res.status(200).json({
    success:true,
    message:"Owner Logged out successfully"
  })
}