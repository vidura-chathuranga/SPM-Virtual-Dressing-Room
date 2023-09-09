import express from 'express';
import AuthRequest from '../middleware/authMiddleware.js';
import { getAllItems } from '../controllers/ItemsController.js';


const Router  = express.Router();


// use middleWare to validate route
Router.use(AuthRequest);

Router.get("/",getAllItems);


export default Router;