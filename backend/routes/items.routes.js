import express from 'express';
import AuthRequest from '../middleware/authMiddleware.js';
import { AddItem, deleteItem, getAllItems, updateItem,getItemById } from '../controllers/ItemsController.js';


const Router  = express.Router();



Router.get("/",getAllItems);

// use middleWare to validate route
Router.use(AuthRequest)
Router.post("/add",AddItem);
Router.delete("/delete/:id",deleteItem);
Router.put("/update",updateItem);
Router.get("/:id",getItemById);

export default Router;