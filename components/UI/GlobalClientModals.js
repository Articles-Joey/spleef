"use client";

import GlobalClientModals from "@articles-media/articles-dev-box/GlobalClientModals";
import packageInfo from "@/package.json";
import { useStore } from "@/hooks/useStore";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { createSettingsModalConfig } from "./SettingsModal";

export default function AppClientModals() {
    const darkMode = useStore((state) => state.darkMode);

    return (
        <GlobalClientModals
            useStore={useStore}
            useAudioStore={useAudioStore}
            useTouchControlsStore={useTouchControlsStore}
            useSocketStore={useSocketStore}
            packageInfo={packageInfo}
            settingsModalConfig={createSettingsModalConfig()}
            infoModalConfig={{
                previewImage: darkMode ? "/img/background-dark.webp" : "/img/background.webp",
            }}
        />
    );
}
