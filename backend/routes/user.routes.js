import express from 'express';
import { userLogin, userRegister } from '../controllers/userController.js';


// express router
const router = express.Router();

// user register
router.post("/register",userRegister);

//user login 
router.post("/login",userLogin);

export default router;