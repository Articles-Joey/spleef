"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import ArticlesModal from "./ArticlesModal";
import ArticlesButton from "./Button";

export default function PrivateGameModal({ show = true, setShow }) {
    const [action, setAction] = useState("");
    const [room, setRoom] = useState("");

    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Private Game Settings"
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton variant="outline-dark" onClick={() => setOpen(false)}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton variant="success" disabled={room.length < 3}>
                        Join
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{ display: "flex" }}>
                {["Join", "Start"].map((option) => (
                    <ArticlesButton
                        key={option}
                        sx={{ width: "50%" }}
                        active={action === option}
                        onClick={() => setAction(option)}
                    >
                        {option} Private Game
                    </ArticlesButton>
                ))}
            </Box>
            {action && (
                <Box sx={{ mt: "0.5rem" }}>
                    <Divider sx={{ my: "1rem" }} />
                    <Box sx={{ mb: "0.5rem" }}>{action} Options</Box>
                    <TextField
                        fullWidth
                        size="small"
                        id="room-code"
                        label="Room Code"
                        value={room}
                        onChange={(event) => setRoom(event.target.value)}
                        helperText="At least 3 characters. Only letters, numbers, underscores (_), and dashes (-) can be used."
                    />
                </Box>
            )}
        </ArticlesModal>
    );
}
