import { useContext } from "react"
import { AuthContextAdmin } from "../contexts/AuthContextAdmin";


export const useAuthContextAdmin = () =>{

    const context = useContext(AuthContextAdmin);

    if(!context){
        throw Error("useAuthContext must be used inside an AuthContextProvider")
    }

    return context;
}