"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import BlockIcon from "@mui/icons-material/Block";
import { usePeerStore } from "@/hooks/usePeerStore";
import ArticlesButton from "./Button";

export default function PeerDetails({ kickPlayer }) {
    const peer = usePeerStore((state) => state.peer);
    const isHost = usePeerStore((state) => state.isHost);
    const displayId = usePeerStore((state) => state.displayId);
    const gameState = usePeerStore((state) => state.gameState);

    if (!peer || !displayId) return null;

    return (
        <Card sx={{ bgcolor: "game.card" }}>
            <CardContent sx={{ p: "1rem", "&:last-child": { pb: "1rem" } }}>
                <Typography sx={{ fontSize: "0.875em", color: "text.secondary" }}>Multiplayer Peer Info</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: 1, borderColor: "divider", p: "0.25rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ArticlesButton
                            sx={{ mr: "0.5rem" }}
                            aria-label="Copy invite link"
                            onClick={() => navigator.clipboard.writeText(window.location.origin + "/play?server=" + displayId)}
                        >
                            <ContentPasteIcon fontSize="small" />
                        </ArticlesButton>
                        <Box component="span">
                            ID: <Box component="span" sx={{ fontWeight: 700, fontSize: "1.25rem", color: "primary.main" }}>{displayId}</Box>
                        </Box>
                    </Box>
                    {isHost && <Chip label="HOST" color="success" size="small" />}
                </Box>
                <Typography sx={{ color: "text.secondary", mt: "0.25rem", fontSize: "0.8rem" }}>
                    Share this ID with friends to play together! Clipboard button copies the invite link.
                </Typography>
                <Box sx={{ border: 1, borderColor: "divider", mt: "1rem" }}>
                    <Typography sx={{ borderBottom: 1, borderColor: "divider", fontSize: "0.875em", color: "text.secondary", mb: "0.25rem" }}>
                        Players ({gameState?.players?.length || 0})
                    </Typography>
                    <List disablePadding sx={{ fontSize: "0.875em" }}>
                        {gameState?.players?.map((player) => (
                            <ListItem key={player.id} sx={{ px: 0, py: "0.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
                                <Box>
                                    <Box component="span" sx={{ fontWeight: player.id === peer.id ? 700 : 400 }}>
                                        {player.nickname || player.id} {player.id === peer.id ? "(You)" : ""}
                                    </Box>
                                    <Chip label="Player" size="small" color="primary" sx={{ ml: "0.5rem", fontSize: "0.7em", height: 20 }} />
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box component="span" sx={{ color: "text.secondary", fontFamily: "monospace", mr: "0.5rem" }}>
                                        {player.position?.map((coordinate) => Math.round(coordinate)).join(", ")}
                                    </Box>
                                    {isHost && player.id !== peer.id && (
                                        <IconButton size="small" color="error" aria-label="Kick player" title="Kick Player" onClick={() => kickPlayer?.(player.id)}>
                                            <BlockIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
}
