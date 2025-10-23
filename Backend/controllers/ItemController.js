import { uploadFile } from "../config/cloudconfig.js";
import Item from "../models/Item.js";
import Like from "../models/Like.js"
import { v4 as uuidv4 } from "uuid";
import Save from "../models/Save.js";

export const createItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    // Upload to ImageKit
    const fileUpload = await uploadFile(req.file.buffer, uuidv4());

    const foodItem = await Item.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUpload.url,  // 👈 yahan tumhe video ka ImageKit ka hosted link milega
      owner: req.owner._id,
    });

    res.json({
      success: true,
      message: "Item added",
      item: foodItem,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const user = req.user; // logged-in user
    const foodItems = await Item.find({});

    // har item pe check karo ki ye user ne like/save kiya hai ya nahi
    const itemsWithUserStatus = await Promise.all(
      foodItems.map(async (item) => {
        const isLiked = await Like.findOne({ user: user._id, item: item._id });
        const isSaved = await Save.findOne({ user: user._id, item: item._id });
        return {
          ...item.toObject(),
          isLiked: !!isLiked,
          isSaved: !!isSaved,
        };
      })
    );

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItem: itemsWithUserStatus,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const likeFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const item = await Item.findById(foodId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const isLike = await Like.findOne({ user: user._id, item: foodId });

    if (isLike) {
      await Like.deleteOne({ user: user._id, item: foodId });
      item.likeCount = Math.max(item.likeCount - 1, 0); // prevent negative
      await item.save();

      return res.status(200).json({
        message: "Food unliked successfully",
        likeCount: item.likeCount
      });
    }

    await Like.create({ user: user._id, item: foodId });
    item.likeCount += 1;
    await item.save();

    res.status(201).json({
      message: "Food liked",
      likeCount: item.likeCount
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



export const SaveFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const item = await Item.findById(foodId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const isAlreadySaved = await Save.findOne({ user: user._id, item: foodId });

    if (isAlreadySaved) {
      await Save.deleteOne({ user: user._id, item: foodId });
      item.savesCount = Math.max(item.savesCount - 1, 0);
      await item.save();

      return res.status(200).json({
        message: "Food unsaved successfully",
        savesCount: item.savesCount
      });
    }

    await Save.create({ user: user._id, item: foodId });
    item.savesCount += 1;
    await item.save();

    res.status(201).json({
      message: "Food saved successfully",
      savesCount: item.savesCount
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getSaveFood = async (req, res) => {
    try {
        const user = req.user;

        // Fix: Use correct model name and populate the item field
        const savedFoods = await Save.find({ user: user._id }).populate('item');

        if (!savedFoods || savedFoods.length === 0) {
            return res.status(404).json({ message: "No saved foods found" });
        }

        res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching saved foods",
            error: error.message
        });
    }
}
