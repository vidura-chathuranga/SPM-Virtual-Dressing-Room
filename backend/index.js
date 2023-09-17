import express from "express";
import 'dotenv/config';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import dbConnect from "./configs/dbConfig.js";
import ItemsRoutes from './routes/items.routes.js';
import AdminRoutes from './routes/admin.routes.js';
import HumanModelRoutes from './routes/humanModel.routes.js';

// initialize the express
const app = express();

// port
const PORT = process.env.PORT || 6001;

// intialize the cors 
app.use(cors());

// accept json
app.use(express.json({limit : '50mb'}));

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

// redirect to admin routes
app.use("/admin",AdminRoutes);

app.use('/human',HumanModelRoutes);

// started server
app.listen(PORT,()=>{
    console.log(`🚀 SERVER STARTED ON PORT : ${PORT}`);
    dbConnect();
});