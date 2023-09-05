import express from "express";
import 'dotenv/config';

// initialize the express
const app = express();


// port
const PORT = process.env.PORT || 6001;


// accept json
app.use(express.json());

app.use(express.urlencoded({extended:false}));

// started server
app.listen(PORT,()=>{
    console.log(`🚀 SERVER STARTED ON PORT : ${PORT}`);
});