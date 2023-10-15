import express from "express";
import AuthRequest from "../middleware/authMiddleware.js";
import {
  createCart,
  getCartByUserId,
  updateCart,
} from "../controllers/cartController.js";

const Router = express.Router();

// use middleWare to validate route
Router.use(AuthRequest);

Router.post("/", createCart);

Router.get("/:id", getCartByUserId);

Router.put("/:id", updateCart);

export default Router;
