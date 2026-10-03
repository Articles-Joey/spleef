"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import ReplayIcon from "@mui/icons-material/Replay";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArticlesModal from "./ArticlesModal";
import ArticlesSwitch from "./ArticlesSwitch";
import ArticlesButton from "./Button";
import ViewUserModal from "./ViewUserModal";
import useGameScoreboard from "@/hooks/useGameScoreboard";

export default function GameScoreboard({ game, reloadScoreboard, setReloadScoreboard }) {
    const [showSettings, setShowSettings] = useState(false);
    const [visible, setVisible] = useState(false);
    const { data: scoreboard, mutate: scoreboardMutate } = useGameScoreboard({ game });

    useEffect(() => {
        if (reloadScoreboard) {
            setReloadScoreboard?.(false);
            scoreboardMutate();
        }
    }, [reloadScoreboard, setReloadScoreboard, scoreboardMutate]);

    return (
        <Box sx={{ width: "100%", maxWidth: 300 }}>
            {showSettings && (
                <ArticlesModal show={showSettings} setShow={setShowSettings} title="Scoreboard Settings">
                    <FormControlLabel
                        sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
                        labelPlacement="start"
                        label={<Box sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}><EmojiEventsIcon fontSize="small" />Join Scoreboard?</Box>}
                        control={<ArticlesSwitch checked={visible} setChecked={setVisible} />}
                    />
                </ArticlesModal>
            )}

            <Card sx={{ bgcolor: "game.card", mb: "1rem", "@media (min-width: 992px)": { mb: 0 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "1rem", py: "0.5rem", borderBottom: 1, borderColor: "divider" }}>
                    <Box component="span">{game} Scoreboard</Box>
                    <ArticlesButton small aria-label="Refresh scoreboard" onClick={() => scoreboardMutate()}>
                        <ReplayIcon fontSize="small" />
                    </ArticlesButton>
                </Box>
                <Box>
                    {!scoreboard?.length && <Typography sx={{ fontSize: "0.875em", p: "0.5rem" }}>No scores yet</Typography>}
                    {scoreboard?.map((doc, index) => (
                        <Box key={doc._id} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderBottom: 1, borderColor: "divider", p: "0.5rem" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", lineHeight: 1.25 }}>
                                <Box sx={{ display: "flex" }}>
                                    <Typography component="h5" sx={{ fontSize: "1.25rem", m: "0 1rem 0 0" }}>{index + 1}</Typography>
                                    <Box sx={{ lineHeight: 1.25 }}>
                                        <ViewUserModal populated_user={doc.populated_user} user_id={doc.user_id} />
                                    </Box>
                                </Box>
                                <Typography component="h5" sx={{ fontSize: "1.25rem", m: 0 }}>{doc.score || doc.total}</Typography>
                            </Box>
                            {doc.last_play && doc.public_last_play && (
                                <Typography component="small" sx={{ mt: "0.25rem", fontSize: "0.75rem" }}>
                                    Played: {format(new Date(doc.last_play), "MM/d/yy hh:mmaa")}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "1rem", py: "0.5rem", borderTop: 1, borderColor: "divider" }}>
                    <Typography sx={{ fontSize: "0.875em" }}>Play to get on the board!</Typography>
                    <ArticlesButton small aria-label="Scoreboard settings" onClick={() => setShowSettings(true)}>
                        <SettingsIcon fontSize="small" />
                    </ArticlesButton>
                </Box>
            </Card>
        </Box>
    );
}
