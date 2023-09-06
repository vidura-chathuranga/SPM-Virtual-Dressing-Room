import mongoose from "mongoose";

// database connection function
const dbConnect = () =>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((res) =>{
        console.log(`💻 DB SYNCED`);
    }).catch((error) =>{
        console.log(`${error.message}`);
    });
}

export default dbConnect;