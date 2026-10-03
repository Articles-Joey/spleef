"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArticlesModal from "./ArticlesModal";
import { useStore } from "@/hooks/useStore";

export default function GameInfoModal({ show = true, setShow }) {
    const darkMode = useStore((state) => state.darkMode);

    return (
        <ArticlesModal show={show} setShow={setShow} title="Game Info">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                    component="img"
                    src={darkMode ? "/img/background-dark.webp" : "/img/background.webp"}
                    alt="Spleef game preview"
                    sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
                />
                <Box sx={{ p: "1rem" }}>
                    <Typography sx={{ fontWeight: 700, mb: "0.5rem" }}>Spleef</Typography>
                    <Typography>
                        Stay in the game longer than all the other players. Each platform disappears shortly
                        after you land on it. Jump from platform to platform to avoid falling down the
                        different levels. If you fall all the way through, you will be eliminated.
                    </Typography>
                </Box>
            </Box>
        </ArticlesModal>
    );
}
