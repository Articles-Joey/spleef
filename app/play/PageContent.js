"use client"
import ArticlesButton from "@/components/UI/Button";
import MenuPanelContent from "@/components/UI/MenuPanelContent";
import GameCanvas from "@/components/GameCanvas";
import { useEffect, useState } from "react";
import { useLocalStorageNew } from "@/hooks/useLocalStorageNew";
import useFullscreen from "@/hooks/useFullScreen";
import { useSearchParams } from "next/navigation";
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useHotkeys } from "react-hotkeys-hook";

export default function GamePage() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server } = searchParamsObject

    const [showMenu, setShowMenu] = useState(false)

    const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    const [sceneKey, setSceneKey] = useState(0);

    // const [reloadableKey, setReloadableKey] = useState(0)

    useHotkeys('r', () => {
        setSceneKey((prev) => prev + 1)
    })

    const [gameState, setGameState] = useState(false)

    const setSurvivalTimer = useSpleefGameStore(state => state.setSurvivalTimer);
    const setAlive = useSpleefGameStore(state => state.setAlive);

    // Function to handle scene reload
    const reloadScene = () => {
        setSurvivalTimer(0)
        setAlive(true)
        setSceneKey((prevKey) => prevKey + 1);
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        server,
        // players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        // controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu
    }

    useEffect(() => {
        reloadScene()
    }, [])

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    useEffect(() => {

        if (socket.connected && server) {
            socket.emit(
                'join-room', 
                `game:spleef-room-${server}`,
                {
                    test: 'test',
                    game_id: server
                }
            );
        }

        return function cleanup() {
            socket.emit('leave-room', `game:spleef-room-${server}`)
        };

    }, [socket.connected]);

    return (

        <div
            className={`spleef-game-page ${isFullscreen && 'fullscreen'}`}
            id="spleef-game-page"
        >

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
                    </ArticlesButton>

                    {/* <MenuBarControls /> */}

                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <MenuPanelContent
                    {...panelProps}
                />
            </div>

            {/* <TouchControls
                    touchControlsEnabled={touchControlsEnabled}
                /> */}

            <div className='panel-left card rounded-0 d-none d-lg-flex'>

                <MenuPanelContent
                    {...panelProps}
                />

            </div>

            {/* <div className='game-info'>
                    <div className="card card-articles card-sm">
                        <div className="card-body">
                            <pre> 
                                {JSON.stringify(playerData, undefined, 2)}
                            </pre>
                        </div>
                    </div>
                </div> */}

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                    gameState={gameState}
                // playerData={playerData}
                // setPlayerData={setPlayerData}
                // players={players}
                />

            </div>

        </div>
    );

}