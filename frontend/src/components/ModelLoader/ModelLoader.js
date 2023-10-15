import React, { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import axios from "axios";


const ModelLoader = ({ url, onModelLoad }) => {
    const [glb, setGlb] = useState(null);

    useEffect(() => {
        const fetchGLB = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/human/getglb/${url}`);
                setGlb(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGLB();
    }, [url]);

    const { scene } = useGLTF(glb); // Assert the type of glb

    useEffect(() => {
        if (scene) {
            onModelLoad(scene);
        }
    }, [scene, onModelLoad]);

    return null;
};

export default ModelLoader