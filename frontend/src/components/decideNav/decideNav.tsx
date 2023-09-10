import { useLocation } from "react-router-dom";
import SiteHeader from "../SiteHeader/header";


const DecideNav = () =>{
    const location = useLocation();
    
    if(location.pathname.startsWith("/admin/dashboard")){
        return <></>
    }
    else if(location.pathname.startsWith("/admin")){
        return <></>
    }else if(location.pathname.startsWith("/user")){
        return <SiteHeader/>
    }else{
        return <></>
    }
}

export default DecideNav;