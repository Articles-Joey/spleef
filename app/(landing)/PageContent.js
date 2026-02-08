"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
// import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
// import IsDev from '@/components/IsDev';
// import { ChromePicker } from 'react-color';
// import { useSocketStore } from '@/hooks/useSocketStore';

import useUserGameScore from '@/hooks/User/useUserGameScore';
import { useSpleefGameStore } from '@/hooks/useSpleefGameStore';

import GameScoreboard from '@articles-media/articles-dev-box/GameScoreboard';
import Ad from '@articles-media/articles-dev-box/Ad';
const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);
import { GamepadKeyboard, PieMenu } from '@articles-media/articles-gamepad-helper';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import PeerDetails from '@/components/UI/PeerDetails';
import { usePeerStore } from '@/hooks/usePeerStore';

const game_key = 'spleef'
const game_name = 'Spleef'

export default function GameLobbyPage() {

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));

    // const userReduxState = useSelector((state) => state.auth.user_details)
    // const userReduxState = false

    const [joinGame, setJoinGame] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)
    const nickname = useSpleefGameStore(state => state.nickname)
    const darkMode = useSpleefGameStore(state => state.darkMode);
    const toggleDarkMode = useSpleefGameStore(state => state.toggleDarkMode);
    const setNickname = useSpleefGameStore(state => state.setNickname)
    const setShowInfoModal = useSpleefGameStore(state => state.setShowInfoModal)
    const setShowSettingsModal = useSpleefGameStore(state => state.setShowSettingsModal)
    const setShowCreditsModal = useSpleefGameStore(state => state.setShowCreditsModal)

    const resetPeerStore = usePeerStore(state => state.reset);

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showSettingsModal, setShowSettingsModal] = useState(false)
    // const [showPrivateGameModal, setShowPrivateGameModal] = useState(false)

    const [lobbyDetails, setLobbyDetails] = useState({
        players: [],
        games: [],
    })

    const {
        data: userHighScore,
        mutate: userHighScoreMutate
    } = useUserGameScore({
        game: 'Spleef'
    });

    useEffect(() => {
        resetPeerStore();
        setIsMounted(true)
    }, [])

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3021"
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    return (

        <div className="spleef-landing-page">

            <Suspense>
                {/* <GamepadKeyboard
                    disableToggle={true}
                    active={nicknameKeyboard}
                    onFinish={(text) => {
                        console.log("FINISH KEYBOARD", text)
                        useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                    onCancel={(text) => {
                        console.log("CANCEL KEYBOARD", text)
                        // useStore.getState().setNickname(text);
                        useStore.getState().setNicknameKeyboard(false);
                    }}
                /> */}
                <PieMenu
                    options={[
                        {
                            label: 'Settings',
                            icon: 'fad fa-cog',
                            callback: () => {
                                setShowSettingsModal(prev => !prev)
                            }
                        },
                        {
                            label: 'Go Back',
                            icon: 'fad fa-arrow-left',
                            callback: () => {
                                window.history.back()
                            }
                        },
                        {
                            label: 'Credits',
                            icon: 'fad fa-info-circle',
                            callback: () => {
                                setShowCreditsModal(true)
                            }
                        },
                        {
                            label: 'Game Launcher',
                            icon: 'fad fa-gamepad',
                            callback: () => {
                                window.location.href = 'https://games.articles.media';
                            }
                        },
                        {
                            label: `${darkMode ? "Light" : "Dark"} Mode`,
                            icon: 'fad fa-palette',
                            callback: () => {
                                toggleDarkMode()
                            }
                        }
                    ]}
                    onFinish={(event) => {
                        console.log("Event", event)
                        if (event.callback) {
                            event.callback()
                        }
                    }}
                />
            </Suspense>

            {/* {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            } */}

            <div className='background-wrap'>
                <img
                    src={darkMode ? `img/background-dark.webp` : `img/background.webp`}
                    alt="Game background"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'blur(5px)'
                    }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                <div
                    style={{ "width": "20rem" }}
                >

                    {
                        userHighScore?.score
                        &&
                        <div className='card card-articles card-sm mb-3'>
                            <div className='card-body'>
                                <div className="fw-bold mb-1 small text-center">
                                    Your user high score: {userHighScore?.score || 0}
                                </div>
                            </div>
                        </div>
                    }

                    <div className='mb-3'>
                        <PeerDetails
                            // kickPlayer={kickPlayer} 
                        />
                    </div>

                    <div
                        className="card card-articles card-sm mb-3"
                    >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <div
                                style={{
                                    marginRight: '10px',
                                }}
                            >
                                <Image
                                    src={`/img/spleef-thumbnail-sm.jpg`}
                                    width={75}
                                    height={75}
                                    alt=""
                                >

                                </Image>
                            </div>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <input
                                        type="text"
                                        placeholder={"Display name or username"}
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value)
                                        }}
                                        className={`form-control form-control-sm`}
                                    />
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>

                        </div>

                        <div className="card-body">

                            {joinGame === false &&
                                <>
                                    <Link
                                        href={{
                                            pathname: `/play`,
                                        }}
                                    >
                                        <ArticlesButton className="w-100 mb-2">
                                            <i className="fad fa-play"></i>
                                            Start Game
                                        </ArticlesButton>
                                    </Link>

                                    <ArticlesButton
                                        className="w-100"
                                        onClick={() => {
                                            setJoinGame("")
                                        }}
                                    >
                                        <i className="fad fa-users"></i>
                                        Join Game
                                    </ArticlesButton>

                                    {/* Future Websockets or hybrid infra system */}
                                    <div className='d-none'>
                                        <div className="fw-bold mb-1 small text-center">
                                            {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                                        </div>

                                        <div className="servers">

                                            {[1, 2, 3, 4].map(id => {

                                                let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                                    parseInt(lobby.server_id) == id
                                                )

                                                return (
                                                    <div key={id} className="server">

                                                        <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                            <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                            <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                                        </div>

                                                        <div className='d-flex justify-content-around w-100 mb-1'>
                                                            {[1, 2, 3, 4].map(player_count => {

                                                                let playerLookup = false

                                                                if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                                return (
                                                                    <div key={player_count} className="icon" style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        ...(playerLookup ? {
                                                                            backgroundColor: 'black',
                                                                        } : {
                                                                            backgroundColor: 'gray',
                                                                        }),
                                                                        border: '1px solid black'
                                                                    }}>

                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        <Link
                                                            className={``}
                                                            href={{
                                                                pathname: `/play`,
                                                                query: {
                                                                    server: id
                                                                }
                                                            }}
                                                        >
                                                            <ArticlesButton
                                                                className="px-5"
                                                                small
                                                            >
                                                                Join
                                                            </ArticlesButton>
                                                        </Link>

                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>
                                </>
                            }

                            {joinGame !== false &&
                                <>
                                    <div className="form-group articles mb-0">
                                        <label htmlFor="nickname">Server ID</label>
                                        {/* <SingleInput
                                    value={nickname}
                                    setValue={setNickname}
                                /> */}
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="server-id"
                                            value={joinGame}
                                            autoFocus
                                            autoComplete="off"
                                            onChange={(e) => setJoinGame(e.target.value)}
                                        ></input>
                                    </div>
                                    <div style={{ fontSize: '0.8rem' }}>Enter the 4 digit Server ID</div>

                                    <div className='d-flex justify-content-center mt-3'>
                                        <ArticlesButton
                                            className=""
                                            onClick={() => {
                                                setJoinGame(false)
                                            }}
                                        >
                                            <i className="fad fa-arrow-left"></i>
                                            Go Back
                                        </ArticlesButton>
                                        <Link href={{
                                            pathname: "/play",
                                            query: {
                                                server: joinGame
                                            }
                                        }}>
                                            <ArticlesButton
                                                className=""
                                                onClick={() => {
                                                    // setJoinGame("")
                                                }}
                                            >
                                                <i className="fad fa-play"></i>
                                                Join Game
                                            </ArticlesButton>
                                        </Link>
                                    </div>
                                </>
                            }

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <div className='w-50 d-flex'>
                                <ArticlesButton
                                    className={`flex-grow-1`}
                                    small
                                    onClick={() => {
                                        setShowSettingsModal(true)
                                    }}
                                >
                                    <i className="fad fa-cog"></i>
                                    Settings
                                </ArticlesButton>
                                <ArticlesButton
                                    className={``}
                                    small
                                    active={darkMode}
                                    onClick={() => {
                                        toggleDarkMode()
                                    }}
                                >
                                    {
                                        darkMode ?
                                            <i className="fad fa-sun"></i>
                                            :
                                            <i className="fad fa-moon"></i>
                                    }
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
                            </ArticlesButton>

                            <Link href={'https://github.com/Articles-Joey/spleef'} className='w-50' target='_blank' rel='noreferrer'>
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    GitHub
                                </ArticlesButton>
                            </Link>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowCreditsModal(true)
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>

                    <ReturnToLauncherButton />

                </div>

                <GameScoreboard
                    game={game_name}
                    style="Default"
                    darkMode={darkMode ? true : false}
                />

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={game_name}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>
        </div>
    );
}