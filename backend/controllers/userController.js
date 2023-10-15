import validator from "validator";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import userService from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import braintree from "braintree";
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "g2kphndjyxcw54ct",
  publicKey: "gn3x6hr6tk5vpw6q",
  privateKey: "b2ef0eed80820bae1873be6be0d5edb7",
});

// user register function
export const userRegister = async (req, res) => {
  // destructure user details from the request
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    shippingAddress,
  } = req.body;

  try {
    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      throw new Error("fill all required fileds");
    }

    if (!validator.isEmail(email)) {
      throw new Error("wrong email address");
    }

    if (mobileNumber.length !== 10) {
      throw new Error("mobile number format is wrong");
    }

    // validate password length
    if (password.length < 8) {
      throw new Error("Password length should be greater than equal to 8");
    }

    const exist = await User.findOne({ email });

    if (exist) {
      throw new Error("User already registered");
    }

    // generate the salt
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
    // hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
      shippingAddress,
    });

    // create access Token
    const accessToken = jwt.sign(
      { _id: newUser._id },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.status(201).json({ email, firstName, accessToken, _id: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// user login function
export const userLogin = async (req, res) => {
  // destructure request body
  const { email, password } = req.body;

  try {
    // checking fields are fill correctly
    if (!email || !password) {
      throw new Error("required fields are empty");
    }

    // validate email
    if (!validator.isEmail(email)) {
      throw new Error("invalid email");
    }

    // get the user details
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("user credentials are wrong");
    }

    // checking whether the password is correct or wrong
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("user credentials are wrong");
    }

    // create access Token
    const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, {
      expiresIn: "3d",
    });

    // get user name
    const { firstName, _id } = user;

    // send the response to the user
    res.status(200).json({ email, firstName, accessToken, _id: _id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      throw new Error("user not found");
    }

    //if req.body.email is not equal to user.email and req.body.email is already exist in the database
    if (req.body.email !== user.email) {
      const emailUser = User.findOne({ email: req.body.email });
      if (emailUser) {
        throw new Error("email already exist");
      }
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const userID = req.params.id;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userID);

    if (!user) {
      throw new Error("user not found");
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      throw new Error("Current password is wrong");
    }

    // generate the salt
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
    // hash the password
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const newUser = {
      password: hashedPassword,
    };

    const updatedUser = await User.findByIdAndUpdate(userID, newUser, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentInfoByUserId = async (req, res, next) => {
  await userService
    .getPaymentInfoByUserId(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updatePaymentInfoByUserId = async (req, res, next) => {
  await userService
    .updatePaymentInfoByUserId(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getClientToken = async (req, res, next) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      req.handleResponse.errorRespond(res)(err);
      next();
    } else {
      const responseToSend = {
        status: "success",
        message: "Client Token Generated",
        clientToken: response.clientToken,
      };
      req.handleResponse.successRespond(res)(responseToSend);
      next();
    }
  });
};

export const makePayment = async (req, res, next) => {
  //create the order
  const order = await Order.create({
    user: req.body.order.user,
    items: req.body.order.items,
    total: req.body.order.total,
  });
  await gateway.transaction.sale(
    {
      amount: req.body.order.total,
      merchantAccountId: "virtualdressingroom",
      paymentMethodNonce: req.body.nonce,
      orderId: req.params.id + "-" + order._id,
      options: {
        submitForSettlement: true,
      },
    },
    async function (err, result) {
      if (err) {
        req.handleResponse.paymentErrorRespond(res)(err, result);
        next();
      } else {
        if (result.success) {
          const paymentObj = {
            user: req.params.id,
            paymentStatus: "Paid",
            amount: result.transaction.amount,
            orderId: order._id,
            transactionId: result.transaction.id,
            paymentDateAndTime: result.transaction.updatedAt,
          };
          await userService
            .createPayment(paymentObj)
            .then(async (data) => {
              //update orderStatus to "Paid"
              const orderObj = {
                orderStatus: "Paid",
              };
              const newOrder = await Order.findByIdAndUpdate(
                order._id,
                orderObj,
                {
                  new: true,
                }
              );
              const responseToSend = {
                status: "success",
                message: "Payment Successful",
                data: {
                  payment: data,
                  order: newOrder,
                },
              };
              req.handleResponse.successRespond(res)(responseToSend);
              next();
            })
            .catch((err) => {
              req.handleResponse.errorRespond(res)(err);
              next();
            });
        } else {
          const responseToSend = {
            status: "error",
            message: "Payment Failed",
          };
          req.handleResponse.paymentErrorRespond(res)(responseToSend, result);
          next();
        }
      }
    }
  );
};
