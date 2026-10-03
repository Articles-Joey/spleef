"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ReplayIcon from "@mui/icons-material/Replay";
import BugReportIcon from "@mui/icons-material/BugReport";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import ArticlesButton from "./Button";
import PeerDetails from "./PeerDetails";
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore";
import { useStore } from "@/hooks/useStore";

export default function MenuPanelContent() {
    const [debugAnchor, setDebugAnchor] = useState(null);
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const survivalTimer = useSpleefGameStore((state) => state.survivalTimer);
    const alive = useSpleefGameStore((state) => state.alive);
    const bestSurvivalTimer = useSpleefGameStore((state) => state.bestSurvivalTimer);
    const teleportToPosition = useSpleefGameStore((state) => state.teleportToPosition);

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Card sx={{ bgcolor: "game.card" }}>
                <CardContent sx={{ display: "flex", flexWrap: "wrap", p: "1rem", "&:last-child": { pb: "1rem" } }}>
                    <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" />
                </CardContent>
            </Card>
            <PeerDetails />
            <Card sx={{ bgcolor: "game.card" }}>
                <CardContent sx={{ p: "1rem", "&:last-child": { pb: "1rem" } }}>
                    <Typography sx={{ fontSize: "0.875em", color: "text.secondary" }}>Debug Controls</Typography>
                    <Box sx={{ fontSize: "0.875em", border: 1, borderColor: "divider", p: "0.5rem" }}>
                        <Box>Best Time: {bestSurvivalTimer}</Box>
                        <Box>Timer: {survivalTimer}</Box>
                        <Box>Alive: {alive ? "True" : "False"}</Box>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene} startIcon={<ReplayIcon />}>Reload Game</ArticlesButton>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={reloadScene} startIcon={<ReplayIcon />}>Reset Camera</ArticlesButton>
                        <ArticlesButton small sx={{ width: "50%" }} onClick={() => teleportToPosition(7, 30, 7)} startIcon={<ReplayIcon />}>Reset Player</ArticlesButton>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            id="debug-menu-button"
                            aria-haspopup="menu"
                            aria-controls={debugAnchor ? "debug-menu" : undefined}
                            aria-expanded={Boolean(debugAnchor)}
                            onClick={(event) => setDebugAnchor(event.currentTarget)}
                            startIcon={<BugReportIcon />}
                        >
                            Debug {debug ? "On" : "Off"}
                        </ArticlesButton>
                        <Menu
                            id="debug-menu"
                            anchorEl={debugAnchor}
                            open={Boolean(debugAnchor)}
                            onClose={() => setDebugAnchor(null)}
                            slotProps={{ list: { "aria-labelledby": "debug-menu-button", sx: { maxHeight: 600, width: 200 } } }}
                        >
                            {[false, true].map((value) => (
                                <MenuItem
                                    key={String(value)}
                                    selected={debug === value}
                                    onClick={() => {
                                        setDebug(value);
                                        setDebugAnchor(null);
                                    }}
                                >
                                    {value ? "True" : "False"}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
