"use client"
// import { useEffect } from "react";
// import dynamic from "next/dynamic";

import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import { useStore } from '@/hooks/useStore';

export default function LayoutClient({ children }) {

    return (
        <>
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
        </>
    );
}
