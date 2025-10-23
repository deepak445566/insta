import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/UserControllers.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/logout", logoutUser);

export default UserRouter;
