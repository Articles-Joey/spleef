"use client"
import { persist } from 'zustand/middleware';
// import { version } from 'react'
// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
// import { nanoid } from 'nanoid'

export const useSpleefGameStore = create()(
    persist(
        (set, get) => ({

            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state
                });
            },

            darkMode: null,
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setDarkMode: (newValue) => {
                set({ darkMode: newValue })
            },

            sidebar: false,
            setSidebar: (newValue) => {
                set({ sidebar: newValue })
            },

            showMenu: false,
            setShowMenu: (newValue) => {
                set({ showMenu: newValue })
            },

            showCreditsModal: false,
            setShowCreditsModal: (value) => set({ showCreditsModal: value }),

            showInfoModal: false,
            setShowInfoModal: (value) => set({ showInfoModal: value }),

            showSettingsModal: false,
            setShowSettingsModal: (value) => set({ showSettingsModal: value }),

            showInviteModal: false,
            setShowInviteModal: (value) => set({ showInviteModal: value }),

            graphicsQuality: "High",
            setGraphicsQuality: (value) => set({ graphicsQuality: value }),

            nickname: "",
            setNickname: (newValue) => {
                set({ nickname: newValue })
            },

            audioSettings: {
                enabled: true,
                backgroundMusicVolume: 50,
                soundEffectsVolume: 50,
            },
            setAudioSettings: (newValue) => set({ audioSettings: newValue }),

            // Mouse and Keyboard
            // Touch
            controlType: "Mouse and Keyboard",
            setControlType: (newValue) => {
                set((prev) => ({
                    controlType: newValue
                }))
            },

            survivalTimer: 0,
            setSurvivalTimer: (newValue) => {
                set((prev) => ({
                    survivalTimer: newValue
                }))
            },
            incrementSurvivalTimer: (newValue) => {
                set((prev) => ({
                    survivalTimer: prev.survivalTimer + 1
                }))
            },

            bestSurvivalTimer: 0,
            setBestSurvivalTimer: (newValue) => {
                set((prev) => ({
                    bestSurvivalTimer: newValue
                }))
            },

            alive: true,
            setAlive: (newValue) => {
                set((prev) => ({
                    alive: newValue
                }))
            },

            debug: false,
            setDebug: (newValue) => {
                set((prev) => ({
                    debug: newValue
                }))
            },

            ref: null,
            api: null,
            // position: [0, 0, 0], // Initial sphere position
            // setPlayer: (ref, api) => set({ ref, api }),
            // setPosition: (position) => set({ position }),

            position: [0, 0, 0], // Initial sphere position
            rotation: 0,
            action: 'Idle',
            setPlayer: (ref, api) => set({ ref, api }),
            setPosition: (position) => set({ position }),
            setRotation: (rotation) => set({ rotation }),
            setAction: (action) => set({ action }),

            sprintEnergy: 5,
            setSprintEnergy: (sprintEnergy) => set({ sprintEnergy }),

            tagCounter: 0,
            setTagCounter: (tagCounter) => set({ tagCounter }),

            tagCounter: 0,
            setTagCounter: (tagCounter) => set({ tagCounter }),

            bullets: [],
            addBullet: (bullet) => set((state) => ({ bullets: [...state.bullets, bullet] })),
            removeBullet: (id) => set((state) => ({ bullets: state.bullets.filter((b) => b.id !== id) })),

        }),
        {
            name: 'spleef-game-storage', // name of the item in the storage (must be unique)
            version: 1,
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true)
            },
            partialize: (state) => ({

                darkMode: state.darkMode,
                sidebar: state.sidebar,
                showMenu: state.showMenu,

                // theme: state.theme,
                nickname: state.nickname,

                // renderMode: state.renderMode,

                touchControlsEnabled: state.touchControlsEnabled,
                // cameraShakeEnabled: state.cameraShakeEnabled,

                // debug: state.debug,
                // devDebugPanel: state.devDebugPanel,
                // debugTab: state.debugTab,
                audioSettings: state.audioSettings,
            }),
        },
    ),
)