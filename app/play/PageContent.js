"use client"
import Box from "@mui/material/Box";
import MenuPanelContent from "@/components/UI/MenuPanelContent";
import GameCanvas from "@/components/Game/GameCanvas";
import { useEffect } from "react";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useSearchParams } from "next/navigation";
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useHotkeys } from "react-hotkeys-hook";
import classNames from "classnames";
import { useRef } from "react";

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import { useStore } from "@/hooks/useStore";

export default function GamePage() {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server } = searchParamsObject

    // const [showMenu, setShowMenu] = useState(false)

    // const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    // const [sceneKey, setSceneKey] = useState(0);
    const setShowMenu = useStore(state => state.setShowMenu);
    const sceneKey = useStore(state => state.sceneKey);
    const setSceneKey = useStore(state => state.setSceneKey);
    const sidebar = useStore(state => state.sidebar);
    const menuOpen = useStore(state => state.showMenu);

    // const [reloadableKey, setReloadableKey] = useState(0)

    useHotkeys('r', () => {
        reloadScene()
    })

    // const [gameState, setGameState] = useState(false)

    const setSurvivalTimer = useSpleefGameStore(state => state.setSurvivalTimer);
    const setAlive = useSpleefGameStore(state => state.setAlive);

    // Function to handle scene reload
    const reloadScene = () => {
        setSurvivalTimer(0)
        setAlive(true)
        useStore.getState().reloadScene()
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // let panelProps = {
    //     // server,
    //     // players,
    //     touchControlsEnabled,
    //     setTouchControlsEnabled,
    //     // reloadScene,
    //     // controllerState,
    //     // isFullscreen,
    //     // requestFullscreen,
    //     // exitFullscreen,
    //     // setShowMenu
    // }

    const reloadSceneRef = useRef(reloadScene);
    reloadSceneRef.current = reloadScene;

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

        <Box
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': menuOpen,
                    'fullscreen': isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
            sx={{ position: "relative", display: "flex" }}
        >

            <GameMenu
                useStore={useStore}
                LeftPanelContent={MenuPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Static Panel",
                }}
            />

            <Box
                className="canvas-wrap"
                sx={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    "& canvas": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                    },
                }}
            >

                <GameCanvas
                    key={sceneKey}
                />

            </Box>

        </Box>
    );

}
