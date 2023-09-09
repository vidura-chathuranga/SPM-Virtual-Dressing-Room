import Item from "../models/items.model.js";

export const getAllItems = async (req, res) => {
  try {
    // get all the Items
    const items = await Item.find({});
    
    // send all the item details to the frontend
    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
