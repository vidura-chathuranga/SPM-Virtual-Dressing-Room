
import mongoose from "mongoose";


const humanSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    chestWidth :{
        type : Number,
        required : true,
       
    },
    height:{
        type : Number,
        required : true,
        
    },
    bust:{
        type : Number,
        required : true,
        
    },
    weist:{
        type : Number,
        required : true,
        
    },
    hip:{
        type : Number,
        required : true,
        
    },
    fileName : {
        type : String,
        required : true
    },
    filePath : {
        type : String,
        required : true
    }
},{timestamps : true});


const Human = mongoose.model("Human",humanSchema);


export default Human;