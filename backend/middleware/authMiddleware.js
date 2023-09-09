import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const AuthRequest = async(req,res,next) =>{

    // verify authentication
    const {authorization} = req.headers;

    // if there is not authrization in request headers
    if(!authorization){
        return res.status(401).json({error: "Authrization token required"});
    }

    // get the access token from the header 
    const accessToken = authorization.split(" ")[1];

    try{    
        const { _id } = jwt.verify(accessToken,process.env.ACCESS_SECRET);

        // inject user_id to request
        req.user = await User.findById(_id).select('_id');
        next();

    }catch(error){
        res.status(401).json({error:"Request is not authorized"});
    }
}

export default AuthRequest;