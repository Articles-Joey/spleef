"use client";

export { default } from "@articles-media/articles-dev-box/SettingsModal";

import { useAudioStore } from "@/hooks/useAudioStore";

export function createSettingsModalConfig() {
    return {
        tabs: {
            Graphics: { darkMode: true, landingAnimation: true },
            Audio: {
                sliders: Object.keys(useAudioStore.getState().audioSettings || {})
                    .filter((key) => key !== "enabled")
                    .map((key) => ({
                        key,
                        label: key.replace(/([a-z])([A-Z])/g, "$1 $2").split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                    })),
            },
            Controls: { touchControls: true },
            Multiplayer: { serverUrl: true },
            Other: { toontownMode: true },
        },
        reset: () => useAudioStore.getState().resetAudioSettings(),
    };
}
