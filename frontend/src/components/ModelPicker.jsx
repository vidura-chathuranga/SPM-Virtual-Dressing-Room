import React from "react";
import tommyJacket from "../assets/tommy.png";
import jacket from "../assets/adidas1.png";
import Gym from "../assets/gym.png";




const ModelPicker = ({ updateSelectedModel }) => {
  
  return (
    
    <>
    
      <div className="model-selector" >
      <div><h1>Pick Your Choice</h1></div>

        <div className="center"onClick={() => updateSelectedModel("Gym")}>
          <img src={Gym} alt="Gym" />
          <h4>Nike Active</h4>
        </div>
        <div className="center"onClick={() => updateSelectedModel("TommyJacket")}>
          <img src={tommyJacket} alt="tommyJacket" />
          <h4>Tommy Jacket</h4>
        </div>
        <div className="center"onClick={() => updateSelectedModel("Jacket")}>
          <img src={jacket} alt="jacket" />
          <h4>Adidas Jacket</h4>
          
        </div>
        
        
      </div>
      
    </>
  );
};

export default ModelPicker;
