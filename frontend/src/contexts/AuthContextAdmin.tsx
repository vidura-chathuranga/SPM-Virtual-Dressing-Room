import { createContext, useReducer, ReactNode,useEffect } from 'react';

export const AuthContextAdmin = createContext(null);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                admin: action.payload
            }
        case 'LOGOUT':
            return { admin: null }
        default:
            return state;
    }
}
export const AuthContextAdminProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        admin: null
    });
    
    useEffect(() =>{

        // checking if there any user object in localstorage
        const user = JSON.parse(localStorage.getItem("admin")!!);

        // if user exist, then set Auth Context
        if(user){
            dispatch({type : 'LOGIN',payload : user});
        }
    },[])
    console.log("Auth context value: ", state);

    return(
        <AuthContextAdmin.Provider value ={{...state,dispatch}}>{children}</AuthContextAdmin.Provider>
    );
}