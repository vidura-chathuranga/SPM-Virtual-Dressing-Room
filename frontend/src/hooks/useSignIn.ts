import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';


export const useSignIn = () => {
    const [isLoading, setLoading] = useState(false);
    const { dispatch }: any = useAuthContext();

    const signIn = async (email: string, password: string) => {
        setLoading(true);

        try {
            // send an reqeust to the login user, added proxy, then we dont want to add a BASE URL
            const response = await axios.post('http://localhost:3001/user/login', { email, password });

            // save the user to the localStorage
            localStorage.setItem("user", JSON.stringify(response.data));

            // update the auth context
            dispatch({ type: "LOGIN", payload: response.data });

        } catch (error: any) {
            // set loading false
            setLoading(false);
            // set error message
            return error.response.data.error;
            
        } finally {
            setLoading(false);
        }
    }

    return { signIn, isLoading }
}