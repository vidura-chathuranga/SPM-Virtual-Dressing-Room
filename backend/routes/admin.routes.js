import express from 'express';
import { adminLogin } from '../controllers/adminController.js';

const Router = express.Router();


// login route
Router.post("/login",adminLogin);


export default Router;