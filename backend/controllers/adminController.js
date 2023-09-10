import Admin from "../models/admin.model.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// admin login function
export const adminLogin = async (req, res) => {
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
      const user = await Admin.findOne({ email });
  
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
      const { name, _id } = user;
  
      // send the response to the user
      res.status(200).json({ email, name, accessToken, _id: _id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };