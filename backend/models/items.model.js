import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    images : [

    ],
    description : {
        type : String,
        required : true
    },
    sellingPrice : {
        type : Number,
        required : true,
    },
    ActualPrice : {
        type : Number,
        required : true
    },
    sizes : {
        type : String,
    },
    Quantity : {
        type : Number,
        required : true,
    },
    rating : {
        type : Number,
        default : 0
    }
},{timestamps : true});

const Item = mongoose.model("Item",ItemSchema);

export default Item;