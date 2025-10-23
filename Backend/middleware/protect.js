import Owner from "../models/Owner.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug

 const ownerId = decoded.id; // ✅ matches payload

    
    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - ownerId not found"
      });
    }

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Owner not found"
      });
    }

    req.owner = owner;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};
export const protectUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("🟡 protectUser - Token:", token); // Debug
    
    if (!token) {
      console.log("❌ protectUser - No token found");
      return res.status(401).json({ message: "Please login first" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟡 protectUser - Decoded token:", decoded); // Debug
    
    // ✅ FIX: Check both userId and id fields
    const userId = decoded.userId || decoded.id;
    console.log("🟡 protectUser - User ID found:", userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - userId not found"
      });
    }

    // Get user from token
    const user = await User.findById(userId).select("-password");
    console.log("🟡 protectUser - User found:", user); // Debug
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found"
      });
    }
    
    // Add user to request object
    req.user = user;
    console.log("🟢 protectUser - Authentication successful");
    next();
    
  } catch (error) {
    console.error("❌ protectUser - Auth middleware error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error in authentication"
    });
  }
};