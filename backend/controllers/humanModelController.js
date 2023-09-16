import Human from "../models/human.model.js";


export const getAllHumanModels = async(req,res) =>{
    try{

        const Models = await Human.find({});

        res.status(200).json(Models);

    }catch(error){
        res.status(500).json({error: error.message});
    }
}
export const createHumanModel = async(req,res) =>{
    console.log(req.body);
}