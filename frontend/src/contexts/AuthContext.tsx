import { createContext, useReducer, ReactNode,useEffect } from 'react';

export const AuthContext = createContext(null);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT':
            return { user: null }
        default:
            return state;
    }
}
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });
    
    useEffect(() =>{

        // checking if there any user object in localstorage
        const user = JSON.parse(localStorage.getItem("user")!!);

        // if user exist, then set Auth Context
        if(user){
            dispatch({type : 'LOGIN',payload : user});
        }
    },[])
    console.log("Auth context value: ", state);

    return(
        <AuthContext.Provider value ={{...state,dispatch}}>{children}</AuthContext.Provider>
    );
}