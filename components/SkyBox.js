import defaultSkyboxes from "@/components/defaultSkyboxes";
import { useThree } from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import { CubeTextureLoader } from "three";
// import { useStore } from "../../../hooks/useStore";

const MyComponentSkyBox = memo(() => {

    const { scene } = useThree();

    const previousBackground = useRef(null);

    // const loader = new CubeTextureLoader();
    const loader = useRef(new CubeTextureLoader()).current; // Memoize loader

    // const {
    //     sceneSettings,
    //     setSceneSettings,
    // } = useStore(state => ({
    //     sceneSettings: state.sceneSettings,
    //     setSceneSettings: state.setSceneSettings,
    // }));

    useEffect(() => {

        let defaultSkyboxLookup = defaultSkyboxes.find(obj => obj.name == "Cartoon Base BlueSky")

        if (defaultSkyboxLookup && previousBackground.current !==  "Cartoon Base BlueSky") {

            // let defaultSkyboxLookup = defaultSkyboxes.find(obj => obj.name == sceneSettings?.skybox?.name)

            // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
            // const texture = loader.load([]);
            // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
            const texture = loader.load([
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/1.jpg",
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/2.jpg",
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/3.jpg",
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/4.jpg",
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/5.jpg",
                // "https://articles-website.s3.amazonaws.com/games/Epcot/Skyboxes/Test/Weird+Space/6.jpg"
                ...defaultSkyboxLookup?.images
            ]);

            // Set the scene background property to the resulting texture.
            scene.background = texture;
            previousBackground.current = "Cartoon Base BlueSky";

        }

        // if (sceneSettings?.skybox?.name == 'Cartoon Base BlueSky' && previousBackground.current !== sceneSettings?.skybox?.name) {

        //     let defaultSkyboxLookup = defaultSkyboxes.find(obj => obj.name == sceneSettings?.skybox?.name)

        //     // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
        //     // const texture = loader.load([]);
        //     // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
        //     const texture = loader.load([
        //         ...defaultSkyboxLookup?.images
        //     ]);

        //     // Set the scene background property to the resulting texture.
        //     scene.background = texture;
        //     previousBackground.current = sceneSettings?.skybox?.name;

        // }

        // Cleanup function to reset the background when the component unmounts
        return () => {
            scene.background = null;
        };

    }, [loader, scene]);

    // return null;

})

MyComponentSkyBox.displayName = 'MyComponentSkyBox';

export default MyComponentSkyBox