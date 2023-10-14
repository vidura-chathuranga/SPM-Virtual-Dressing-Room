import mongoose from "mongoose";


const invoiceSchema = new mongoose.Schema({
    cusName : {
        type : String,
        required : true,
    },
    invoice_id : {
        type : String,
        required : true,
    },
    cusAddress : {
        type : String,
        default : 'not mentioned'
    },
    cusPhone : {
        type : String,
        required : true,
    },
    cusEmail : {
        type : String,
    },
    issuedDate : {
        type : Date,
        required : true,
    },
    items : [
        {
            _id : {
                type : mongoose.Schema.Types.ObjectId,
                required : true,
            },
            price : {
                type : Number,
                required : true,
            },
            quantity : {
                type : Number,
                required : true,
            },
            totalPrice : {
                type : Number,
                required : true,
            },
        }
    ],
    totalActualPrice : {
        type : Number,
        required : true,
    },
    totalSoldPrice : {
        type : Number,
        required : true,
    },
},{timestamps:true});

const Invoice = mongoose.model("invoices",invoiceSchema);

export default Invoice;