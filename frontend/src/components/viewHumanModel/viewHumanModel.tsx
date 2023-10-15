import { Canvas } from "@react-three/fiber";
import { Stage, PresentationControls} from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ModelLoader from "../ModelLoader/ModelLoader";




const ViewHumanModel = () =>{

    const {url} = useParams();

    // const getGlb = () =>{
    //     const result =  axios.get(`http://localhost:3001/human/getglb/${url}`).then((res) => res.data);
    // }
    // getGlb();


    const urlLinks = [
        '/mediumFigure.glb',
        '/smallHumanModel1.glb'
    ]

    const { scene } = useGLTF(urlLinks[Math.floor(Math.random() * 2)]);

   ;

    return (
        // <div></div>
            <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
                <color attach="background" args={["#101010"]} />
                <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
                  <Stage>
                  <primitive object={scene} scale={0.01}/>
                  </Stage>
                </PresentationControls>
            </Canvas>
      )
}


// const ViewHumanModel = () => {
//     const { url } = useParams();
//     // const [scene, setScene] = useState(null);

//     // const handleModelLoad = (loadedScene : any) => {
//     //     setScene(loadedScene);
//     // };

//     // // Wait until the scene is loaded before rendering the 3D model
//     // if (scene === null) {
//     //     return <div>Loading...</div>;
//     // }   

//     console.log("../../../../backend/files/"+url)
//     const { scene } = useGLTF(url!!);

//     return (
//         <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
//             <color attach="background" args={["#101010"]} />
//             <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
//                 <Stage>
//                     <primitive object={scene} scale={0.01} />
//                 </Stage>
//             </PresentationControls>

//             {/* Load the model */}
//             {/* <ModelLoader url={url} onModelLoad={handleModelLoad} /> */}
//         </Canvas>
//     );
// };

export default ViewHumanModel;