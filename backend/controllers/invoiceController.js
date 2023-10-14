import Invoice from "../models/invoices.model.js";


export const getAllInvoices = async(req,res) =>{
    try {
        // get invoices data
        const invoices = await Invoice.find();
    
        // return data
        if (invoices.length === 0) {
          res.status(204).json(invoices);
        } else {
          res.status(200).json(invoices);
        }
      } catch (error) {
        res.status(500).json({ error: error, message: "Invoice fetching error" });
      }
} 