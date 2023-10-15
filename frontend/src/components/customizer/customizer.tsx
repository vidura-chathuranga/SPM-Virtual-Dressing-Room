import {Suspense, useState, useRef } from "react";
import Gym from "../../components/FemaleGym";
import TommyJacket from "../../components/TommyJacket";
import Jacket from "../../components/Adidas1";
import ColorPicker from "../../components/ColorPicker";
import Loader from "../../components/Loader";
import ModelPicker from "../../components/ModelPicker";
import { proxy } from "valtio";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float , ContactShadows , Environment, Lightformer} from "@react-three/drei";
import '../../index.scss';

///jacket/////////////////////////////////////////////////////////////////////////////
const JacketState : any = proxy({
    current: null,
    colors: {design1:"#d3d3d3" , design2:"#d3d3d3" , design3:"#d3d3d3"},
  
  });
  
  ////tommy////////////////////////////////////////////////////////////////////////////
  const TommyJacketState : any= proxy({
    current: null,
    colors: {Stripe1:"#d3d3d3" , Stripe2:"#d3d3d3" },
  
  });
  
  ////femaleGym////////////////////////////////////////////////////////////////////////////
  const GymState : any= proxy({
    current: null,
    colors: {Stripe:"#d3d3d3" , Design:"#d3d3d3"}
  })

const Customizer = () =>{
    const [selectedModel, setSelectedModel] = useState("Jacket");
  const [linkOpened, setLinkOpened] = useState(false);
  const controls  : any= useRef();

 
//jacket//////////////////////////////////////////////////////////////
  const updateJacketCurrent = (value : any) =>{
    JacketState.current = value;
  };
  const updateJacketColor = (pro : any , value : any) => {
    JacketState.colors[pro] = value;
  }
//tommyJacket////////////////////////////////////////////////////////////
  const updateTommyJacketCurrent = (value : any) =>{
    TommyJacketState.current = value;
  };
  const updateTommyJacketColor = (pro : any , value : any) => {
    TommyJacketState.colors[pro] = value;
  }
//femaleGym////////////////////////////////////////////////////////////
  const updateGymCurrent = (value : any) =>{
  GymState.current = value;
  };
  const updateGymColor = (pro : any, value : any) => {
  GymState.colors[pro] = value;
  }

  
  const renderSelectedModel = () => {
    switch (selectedModel) {
      
      case "Gym":
        return (
          <Gym
            castShadow
            colors={GymState.colors}
            updateCurrent={updateGymCurrent}
          />
        );
      case "TommyJacket":
        return (
          <TommyJacket
            castShadow
            colors={TommyJacketState.colors}
            updateCurrent={updateTommyJacketCurrent}
          />
        );
      case "Jacket":
        return(
          <Jacket
          castShadow
          colors={JacketState.colors}
          updateCurrent={updateJacketCurrent}
          />
        );
      default:
        break;
    }
  };

  const renderSelectedColorPicker = () => {
    switch (selectedModel) {
      
      case "Gym":
        return (
          <ColorPicker state={GymState} updateColor={updateGymColor} />
        );
      case "TommyJacket":
        return (
          <ColorPicker state={TommyJacketState} updateColor={updateTommyJacketColor} />
        );
      case "Jacket":
        return(
          <ColorPicker state={JacketState} updateColor={updateJacketColor} />
        );
      default:
        break;
    }
  };

  const updateSelectedModel = (selectedModel : any) => {
    controls.current.reset();
    setSelectedModel(selectedModel);
  };


  return (
    <>
      <ModelPicker updateSelectedModel={updateSelectedModel} />
      {renderSelectedColorPicker()}
      <Canvas shadows camera={{ position: [1, 0, 2] }}>

      {/* /////////////adding floor and stuff here /////////////////////// */}
        <color attach="background" args={['#15151a']} />
        <hemisphereLight intensity={0.5} />
        <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} />
        <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
          <ringGeometry args={[0.9, 1, 4, 1]} />
          <meshStandardMaterial color="white" roughness={0.75} />
        </mesh>
        <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
          <ringGeometry args={[0.9, 1, 3, 1]} />
          <meshStandardMaterial color="white" roughness={0.75} />
        </mesh> 

        

        <ambientLight />
        <spotLight
          intensity={0.5}
          penumbra={1}
          position={[7, 15, 10]}
          castShadow
        />
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 1.1]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        <Suspense fallback={<Loader />}>
          <Float
            speed={1}
            rotationIntensity={1.5}
            floatIntensity={1}
            floatingRange={[0, 0.3]}
          >
            {renderSelectedModel()}
          </Float>
        </Suspense>
        <OrbitControls ref={controls} maxDistance={5} minDistance={1.5} />
      </Canvas>
      
    </>
  );
}

export default Customizer;