import axios from "axios"

// creating an axios object with baseURL
const userAxios = axios.create({
    baseURL : "http://localhost:3001"
});

class UserAPI{

    static  userLogin = (values : {email : string, password : string}) =>{
        return userAxios.post('/user/login',values);
    } 
}

export default UserAPI;