import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    mobileNumber : {
        type : String,
        required : true,
        max : 10
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    cartItems : [
        {
            itemId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Item",
                required : true,
            },
            quantity : {
                type : Number,
                required : true,
                default : 0
            }
        }
    ],
    shippingAddress : {
        type : String,
        default : ""
    },
},{timestamps : true});


// creating user model
const User = mongoose.model("User",userSchema);

export default User;