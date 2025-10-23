import express from "express";
import {
  loginOwner,
  logoutOwner,
  registerOwner,
} from "../controllers/OwnerController.js";
import { protect } from "../middleware/protect.js";

const OwnerRouter = express.Router();

OwnerRouter.post("/register", registerOwner);
OwnerRouter.post("/login", loginOwner);
OwnerRouter.get("/logout", logoutOwner);
OwnerRouter.get("/check-auth", protect, (req, res) => {
  res.status(200).json({ success: true, owner: req.owner });
});


export default OwnerRouter;
