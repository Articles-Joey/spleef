"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PaletteIcon from "@mui/icons-material/Palette";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GroupsIcon from "@mui/icons-material/Groups";
import { GamepadKeyboard, PieMenu } from "@articles-media/articles-gamepad-helper";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import SessionButton from "@articles-media/articles-dev-box/SessionButton";
import useUserDetails from "@articles-media/articles-dev-box/useUserDetails";
import useUserToken from "@articles-media/articles-dev-box/useUserToken";
import ArticlesButton from "@/components/UI/Button";
import PeerDetails from "@/components/UI/PeerDetails";
import useUserGameScore from "@/hooks/User/useUserGameScore";
import { usePeerStore } from "@/hooks/usePeerStore";
import { useStore } from "@/hooks/useStore";

const ReturnToLauncherButton = dynamic(
    () => import("@articles-media/articles-dev-box/ReturnToLauncherButton"),
    { ssr: false },
);
const GameScoreboard = dynamic(
    () => import("@articles-media/articles-dev-box/GameScoreboard"),
    { ssr: false },
);
const Ad = dynamic(() => import("@articles-media/articles-dev-box/Ad"), { ssr: false });

const sidePanelSx = {
    mt: "1rem",
    width: "100%",
    maxWidth: 300,
    "@media (min-width: 992px)": {
        mt: 0,
        display: "block",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
    },
};

export default function GameLobbyPage() {
    const [joinGame, setJoinGame] = useState(false);
    const hydrated = useStore((state) => state._hasHydrated);
    const nickname = useStore((state) => state.nickname);
    const setNickname = useStore((state) => state.setNickname);
    const randomNickname = useStore((state) => state.randomNickname);
    const nicknameKeyboard = useStore((state) => state.nicknameKeyboard);
    const darkMode = useStore((state) => state.darkMode);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const resetPeerStore = usePeerStore((state) => state.reset);
    const { data: userHighScore } = useUserGameScore({ game: "Spleef" });
    const { data: userToken } = useUserToken(process.env.NEXT_PUBLIC_GAME_PORT);
    const { data: userDetails, isLoading: userDetailsLoading } = useUserDetails({ token: userToken });

    useEffect(() => {
        resetPeerStore();
    }, [resetPeerStore]);

    const pieOptions = [
        { label: "Settings", Icon: SettingsIcon, callback: () => useStore.getState().setShowSettingsModal(true) },
        { label: "Go Back", Icon: ArrowBackIcon, callback: () => window.history.back() },
        { label: "Credits", Icon: InfoIcon, callback: () => useStore.getState().setShowCreditsModal(true) },
        { label: "Game Launcher", Icon: SportsEsportsIcon, callback: () => { window.location.href = "https://games.articles.media"; } },
        { label: `${darkMode ? "Light" : "Dark"} Mode`, Icon: PaletteIcon, callback: () => useStore.getState().toggleDarkMode() },
    ];

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                position: "relative",
                isolation: "isolate",
                "& button:focus-visible, & input:focus-visible, & a:focus-visible": {
                    outline: "3px solid #fff",
                    outlineOffset: 2,
                    boxShadow: "0 0 15px rgba(255,255,255,0.8)",
                },
            }}
        >
            <Suspense>
                <Box data-hide-in-screenshot-mode="true">
                    <GamepadKeyboard
                        disableToggle
                        active={nicknameKeyboard}
                        onFinish={(text) => {
                            setNickname(text);
                            useStore.getState().setNicknameKeyboard(false);
                        }}
                        onCancel={() => useStore.getState().setNicknameKeyboard(false)}
                    />
                    <PieMenu
                        options={pieOptions.map(({ label, Icon, callback }) => ({
                            label: (
                                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                                    <Icon fontSize="small" />
                                    {label}
                                </Box>
                            ),
                            callback,
                        }))}
                        onFinish={(event) => event.callback?.()}
                    />
                </Box>
            </Suspense>

            <Box sx={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1 }}>
                <Box
                    component="img"
                    src={darkMode ? "/img/background-dark.webp" : "/img/background.webp"}
                    alt=""
                    sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "blur(2px)" }}
                />
            </Box>

            <Box
                sx={{
                    width: "100%",
                    px: "0.75rem",
                    py: "1rem",
                    display: "flex",
                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    alignItems: "center",
                    "@media (min-width: 992px)": { flexDirection: "row" },
                }}
            >
                <Box sx={{ width: "20rem", maxWidth: "100%", flexShrink: 0 }}>
                    {Boolean(userHighScore?.score) && (
                        <Card sx={{ mb: "1rem", bgcolor: "game.card" }}>
                            <CardContent sx={{ p: "1rem", "&:last-child": { pb: "1rem" } }}>
                                <Typography sx={{ fontWeight: 700, mb: "0.25rem", fontSize: "0.875em", textAlign: "center" }}>
                                    Your user high score: {userHighScore.score}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{ mb: "1rem" }}><PeerDetails /></Box>

                    <Card sx={{ mb: "1rem", bgcolor: "game.card" }}>
                        <Box sx={{ display: "flex", alignItems: "center", p: "0.5rem 1rem", borderBottom: 1, borderColor: "divider" }}>
                            <Box sx={{ mr: "10px", flexShrink: 0 }}>
                                <Image src="/img/spleef-thumbnail-sm.jpg" width={75} height={75} alt="Spleef" />
                            </Box>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nickname"
                                        value={hydrated ? nickname : ""}
                                        disabled={!hydrated}
                                        id="nickname"
                                        name="nickname"
                                        placeholder="Enter your nickname"
                                        onChange={(event) => setNickname(event.target.value)}
                                    />
                                    <ArticlesButton small aria-label="Random nickname" onClick={randomNickname}>
                                        <ShuffleIcon fontSize="small" />
                                    </ArticlesButton>
                                </Box>
                                <Typography sx={{ mt: "0.25rem", fontSize: "0.8rem" }}>Visible to all players</Typography>
                            </Box>
                        </Box>

                        <CardContent sx={{ p: "1rem", "&:last-child": { pb: "1rem" } }}>
                            {joinGame === false ? (
                                <>
                                    <ArticlesButton component={Link} href="/play" sx={{ width: "100%", mb: "0.5rem" }} startIcon={<PlayArrowIcon />}>
                                        Start Game
                                    </ArticlesButton>
                                    <ArticlesButton sx={{ width: "100%" }} onClick={() => setJoinGame("")} startIcon={<GroupsIcon />}>
                                        Join Game
                                    </ArticlesButton>

                                    {/* Reserved for a future WebSocket or hybrid lobby. */}
                                    <Box sx={{ display: "none" }}>
                                        <Typography sx={{ fontWeight: 700, mb: "0.25rem", fontSize: "0.875em", textAlign: "center" }}>
                                            {lobbyDetails?.players?.length || 0} player{lobbyDetails?.players?.length > 1 && "s"} in the lobby.
                                        </Typography>
                                        <Box sx={{ display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                                            {[1, 2, 3, 4].map((id) => {
                                                const lobby = lobbyDetails?.fourFrogsGlobalState?.games?.find((item) => Number(item.server_id) === id);
                                                return (
                                                    <Box key={id} sx={{ p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mb: "0.5rem" }}>
                                                            <Box sx={{ fontSize: "0.9rem", fontWeight: 700 }}>Server {id}</Box>
                                                            <Box>{lobby?.players?.length || 0}/4</Box>
                                                        </Box>
                                                        <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%", mb: "0.25rem" }}>
                                                            {[1, 2, 3, 4].map((count) => (
                                                                <Box key={count} sx={{ width: 20, height: 20, bgcolor: lobby?.players?.length >= count ? "black" : "gray", border: "1px solid black" }} />
                                                            ))}
                                                        </Box>
                                                        <ArticlesButton component={Link} href={{ pathname: "/play", query: { server: id } }} sx={{ px: "3rem" }} small>
                                                            Join
                                                        </ArticlesButton>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Server ID"
                                        id="server-id"
                                        value={joinGame}
                                        autoFocus
                                        autoComplete="off"
                                        onChange={(event) => setJoinGame(event.target.value)}
                                        helperText="Enter the 4 digit Server ID"
                                    />
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: "1rem" }}>
                                        <ArticlesButton onClick={() => setJoinGame(false)} startIcon={<ArrowBackIcon />}>Go Back</ArticlesButton>
                                        <ArticlesButton component={Link} href={{ pathname: "/play", query: { server: joinGame } }} startIcon={<PlayArrowIcon />}>
                                            Join Game
                                        </ArticlesButton>
                                    </Box>
                                </>
                            )}
                        </CardContent>

                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", p: "0.5rem 1rem", borderTop: 1, borderColor: "divider" }}>
                            <GameMenuPrimaryButtonGroup useStore={useStore} type="Landing" />
                        </Box>
                    </Card>

                    <SessionButton port={process.env.NEXT_PUBLIC_GAME_PORT} friendsButton />
                    <ReturnToLauncherButton />
                </Box>

                <Box sx={{ ...sidePanelSx, "@media (min-width: 992px)": { ...sidePanelSx["@media (min-width: 992px)"], left: "1rem" } }}>
                    <GameScoreboard game={process.env.NEXT_PUBLIC_GAME_NAME} style="Default" darkMode={Boolean(darkMode)} />
                </Box>

                <Box sx={{ ...sidePanelSx, "@media (min-width: 992px)": { ...sidePanelSx["@media (min-width: 992px)"], right: "1rem" } }}>
                    <Ad
                        style="Default"
                        section="Games"
                        section_id={process.env.NEXT_PUBLIC_GAME_NAME}
                        darkMode={Boolean(darkMode)}
                        user_ad_token={userToken}
                        userDetails={userDetails}
                        userDetailsLoading={userDetailsLoading}
                    />
                </Box>
            </Box>
        </Box>
    );
}
