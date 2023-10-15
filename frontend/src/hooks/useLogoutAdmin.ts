import { useAuthContextAdmin } from "./useAuthContextAdmin";

export const useLogoutAdmin = () =>{
    const {dispatch} : any = useAuthContextAdmin();

    const logout = () =>{

        // remove user from storage
        localStorage.removeItem("admin");

        // dispatch logount function
        dispatch({type:"LOGOUT"});
        
    }

    return { logout};
}