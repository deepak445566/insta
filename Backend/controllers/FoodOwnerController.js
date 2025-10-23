import Owner from "../models/Owner.js";
import Item from "../models/Item.js"

export const getOwnerById = async (req, res) => {
  const OwnerId = req.params.id;
  const owner = await Owner.findById(OwnerId);
const foodItemByFoodOwner = await Item.find({owner:OwnerId})
if(!owner){
  return res.status(404).json({message:"Food owner not found"})
}
res.status(200).json({
  message: "Food partner retrieved successfully",
  owner:{
    ...owner.toObject(),
    foodItem :foodItemByFoodOwner
  }
})



}