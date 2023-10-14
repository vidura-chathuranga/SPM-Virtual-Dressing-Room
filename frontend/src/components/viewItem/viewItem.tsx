import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { SimpleGrid } from "@mantine/core";
import ImageView from "./imageView";
import Item from "./item";
import { useAuthContext } from "../../hooks/useAuthContext";

const ViewItem = () =>{
    const {id} = useParams();
    const {user} : any = useAuthContext();

    // item details fetch by its Id
    const fetchItemById = async()=>{
        return axios.get(`http://localhost:3001/items/${id}`,{headers : {Authorization : `Bearer ${user.accessToken}`}});
    }

    // fetching the item details
    const {isLoading, data=[]} = useQuery(['itemData'],() => fetchItemById().then((response) => response.data))
    
    return (
        <SimpleGrid cols={2} pos={"absolute"}>
            <div>
                <ImageView images={data?.images} isLoading={isLoading}/>
            </div>
            <div>
                {/* provide item information except the images */}
                <Item itemData={(({images ,...rest} : any) => rest)(data)}/>
            </div>
        </SimpleGrid>
    )
}

export default ViewItem;