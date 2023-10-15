import express from "express";
import {
  userLogin,
  userRegister,
  getUserById,
  updateUserById,
  updatePassword,
  getPaymentInfoByUserId,
  updatePaymentInfoByUserId,
  getClientToken,
  makePayment,
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

//get payment info
router.get("/:id/paymentinfo", getPaymentInfoByUserId);

//update payment info
router.patch("/:id/paymentinfo", updatePaymentInfoByUserId);

//make payment by student id and batch id
router.post("/:id/payment", makePayment);

//get payment token
router.get("/:id/payment/token", getClientToken);

export default router;
