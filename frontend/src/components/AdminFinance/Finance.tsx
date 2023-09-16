import { useAuthContextAdmin } from "../../hooks/useAuthContextAdmin";

const Finance = () =>{
    const {admin} = useAuthContextAdmin();

    console.log(`admin : ${admin}`);

    return(<h1>Hello Finance</h1>)
}

export default Finance;