
import { useAuthContext } from "./useAuthContext";


export const useLogout = () => {
    const { dispatch }: any = useAuthContext();

    const logout = () => {

        // remove user from storage
        localStorage.removeItem("user");

        // dispatch logount function
        dispatch({ type: "LOGOUT" });

    }
    
    return { logout };
}