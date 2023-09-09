import express from "express";
import 'dotenv/config';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import dbConnect from "./configs/dbConfig.js";
import ItemsRoutes from './routes/items.routes.js';

// initialize the express
const app = express();

// port
const PORT = process.env.PORT || 6001;

// intialize the cors 
app.use(cors());

// accept json
app.use(express.json());

app.use(express.urlencoded({extended:false}));


// logged every request to the server terminal
app.use((req,res,next) =>{
    console.log(`${req.method} ====> ${req.url}`);
    next();
});

app.get("/",(req,res)=>{
    res.send("<h1>VIRTURAL DRESSING ROOM API</h1>");
});

// request redirect to the user routes
app.use('/user',userRoutes);
// redirect to the Items route
app.use("/items",ItemsRoutes);

// started server
app.listen(PORT,()=>{
    console.log(`🚀 SERVER STARTED ON PORT : ${PORT}`);
    dbConnect();
});