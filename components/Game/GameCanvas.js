import { Canvas } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader } from "three";
// import GameGrid from "./GameGrid";
// import Tree from "@/components/Games/Epcot/Tree";
// import Witch from "../../../../../../components/Games/Race Game/PlayerModels/Witch";
// import { Star } from "../../../../../../components/Games/Race Game/Star";
import { Debug, Physics } from "@react-three/cannon";
import { Player } from "./Player";
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore";
import FPV from "./FPV";
import Ground from "./Ground";
import { memo, useMemo } from "react";
import Level from "./Level";
import MyComponentSkyBox from "./SkyBox";
import Bullet from "./Bullet";
import Players from "./Players";
import { useStore } from "@/hooks/useStore";

// const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

// const GrassPlane = () => {

//     const width = 110; // Set the width of the plane
//     const height = 110; // Set the height of the plane

//     texture.magFilter = NearestFilter;
//     texture.wrapS = RepeatWrapping
//     texture.wrapT = RepeatWrapping
//     texture.repeat.set(20, 20)

//     return (
//         <>
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
//                 <circleGeometry attach="geometry" args={[width, height]} />
//                 <meshStandardMaterial attach="material" map={texture} />
//             </mesh>
//         </>
//     );
// };

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    // const {
    //     handleCameraChange,
    //     gameState,
    //     players,
    //     move,
    //     cameraInfo,
    //     server
    // } = props;

    const darkMode = useStore(state => state.darkMode);
    const debug = useStore(state => state.debug);

    const controlType = useSpleefGameStore(state => state.controlType);
    const bullets = useSpleefGameStore(state => state.bullets);

    const physicsProps = useMemo(() => ({
        gravity: [0, -10, 0],
        defaultContactMaterial: { friction: 0, restitution: 0 }
    }), [])

    let gameContent = (
        <>

            <Ground
                position={[0, -1, 0]}
            />

            <Player />
            
            <Players />

            {bullets.map((bullet) => (
                <Bullet key={bullet.id} {...bullet} />
            ))}

            {[...Array(5)].map((obj, level_i) => {

                return (
                    <Level
                        key={level_i}
                        level_i={level_i}
                    />
                )

            })}

        </>
    )

    let physicsContent
    if (debug) {
        physicsContent = (
            <Debug>
                {gameContent}
            </Debug>
        )
    } else {
        physicsContent = (
            gameContent
        )
    }

    return (
        <Canvas
            shadows
            camera={{ position: [-10, 40, 40], fov: 50 }}
            id="game-canvas"
        >

            {/* <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            /> */}

            {/* <Sky
                // distance={450000}
                sunPosition={[0, -10, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            /> */}

            <MyComponentSkyBox />

            {controlType == "Mouse and Keyboard" &&
                <FPV
                // location={location}
                // setLocation={setLocation}
                // menuOpen={menuOpen}
                />
            }

            <Physics
                gravity={physicsProps.gravity}
                defaultContactMaterial={physicsProps.defaultContactMaterial}
                // iterations={20}
                // tolerance={0.0001}
            >

                {physicsContent}

            </Physics>

            {/* <GrassPlane /> */}

            {/* <ambientLight intensity={5} /> */}
            <ambientLight intensity={darkMode ? 1 : 5} />
            <spotLight intensity={3000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            {/* <pointLight position={[-10, -10, -10]} /> */}

        </Canvas>
    )
}

export default memo(GameCanvas)