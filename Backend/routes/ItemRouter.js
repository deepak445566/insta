import express from "express";
import { createItem, getAllItems, getSaveFood, likeFood, SaveFood } from "../controllers/ItemController.js";
import { protect, protectUser } from "../middleware/protect.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage()   // ✅ buffer enable
});

const ItemRouter = express.Router();

ItemRouter.post("/create", protect, upload.single("video"), createItem);
ItemRouter.get("/user", protectUser, getAllItems);
ItemRouter.post("/like",protectUser,likeFood);
ItemRouter.post("/save",protectUser,SaveFood)
ItemRouter.get("/saved",protectUser,getSaveFood);
export default ItemRouter;
