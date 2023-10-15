import Cart from "../models/cart.model.js";

export const createCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    const cart = await Cart.create({ user, items });

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id });

    if (!cart) {
      throw new Error("cart not found");
    }

    cart.items = req.body;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
