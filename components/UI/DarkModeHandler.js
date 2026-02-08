"use client"
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore";
// import { useStore } from "@/hooks/useStore";
import { useEffect } from "react";

// import { useEightBallStore } from "@/hooks/useEightBallStore";
// import { useStore } from "../hooks/useStore";

export default function DarkModeHandler({ children }) {

    // const theme = useEightBallStore(state => state.theme);
    const darkMode = useSpleefGameStore((state) => state.darkMode);
    const hasHydrated = useSpleefGameStore((state) => state._hasHydrated);

    useEffect(() => {

        if (!hasHydrated) return;

        if (darkMode == null) {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            useSpleefGameStore.getState().setDarkMode(prefersDark ? true : false);
        }

        if (darkMode) {
            document.body.setAttribute("data-bs-theme", 'dark');
        } else {
            document.body.setAttribute("data-bs-theme", 'light');
        }

    }, [darkMode, hasHydrated]);

    return (
        <>
        </>
    );
}