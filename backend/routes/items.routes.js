import express from 'express';
import AuthRequest from '../middleware/authMiddleware.js';
import { AddItem, deleteItem, getAllItems, updateItem } from '../controllers/ItemsController.js';


const Router  = express.Router();



Router.get("/",getAllItems);

// use middleWare to validate route
Router.use(AuthRequest)
Router.post("/add",AddItem);
Router.delete("/delete/:id",deleteItem);
Router.put("/update",updateItem);

export default Router;