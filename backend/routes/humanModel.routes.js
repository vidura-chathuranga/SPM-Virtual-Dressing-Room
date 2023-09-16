import express from 'express';
import AuthRequest from '../middleware/authMiddleware.js';
import { createHumanModel, getAllHumanModels } from '../controllers/humanModelController.js';


const Router = express.Router();


// use middleWare to validate route
Router.use(AuthRequest);

Router.get("/",getAllHumanModels);
Router.post("/add",createHumanModel);

export default Router;
