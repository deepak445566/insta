import express from "express";
import { getOwnerById } from "../controllers/FoodOwnerController.js";
import { protectUser } from "../middleware/protect.js";
const OwnerFoodRouter = express.Router();


OwnerFoodRouter.get("/:id",protectUser,getOwnerById);






export default OwnerFoodRouter;