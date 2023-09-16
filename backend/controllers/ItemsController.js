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

export const AddItem = async (req, res) => {
  const { title, description, sellingPrice, actualPrice, quantity } = req.body;

  try {
    if (!title || !description || !sellingPrice || !actualPrice || !quantity) {
      throw new Error("All fields are required");
    }

    const item = await Item.create({
      title,
      description,
      ActualPrice: actualPrice,
      sellingPrice,
      Quantity: quantity,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const _id = req.params.id;

  console.log(_id);

  try {
    const deleteItem = await Item.findByIdAndDelete({ _id });

    res.status(200).json(deleteItem);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateItem = async (req, res) => {
  const { _id, title, description, sellingPrice, actualPrice, quantity } =
    req.body;

  try {
    if (!title || !description || !sellingPrice || !actualPrice || !quantity) {
      throw new Error("All fields are required");
    }
    const updatedDocument = await Item.findByIdAndUpdate(
      { _id },
      {
        title,
        description,
        sellingPrice,
        ActualPrice: actualPrice,
        Quantity: quantity,
      },
      { new: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
