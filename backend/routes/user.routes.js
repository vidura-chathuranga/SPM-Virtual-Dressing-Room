import express from "express";
import {
  userLogin,
  userRegister,
  getUserById,
  updateUserById,
  updatePassword,
} from "../controllers/userController.js";

// express router
const router = express.Router();

// user register
router.post("/register", userRegister);

//user login
router.post("/login", userLogin);

//get user by id
router.get("/:id", getUserById);

//update user by id
router.put("/:id", updateUserById);

//update password
router.put("/:id/password", updatePassword);

export default router;
