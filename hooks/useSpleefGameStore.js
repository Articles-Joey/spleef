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

            teleportToPosition: (x, y, z) => {
                const { api } = get();
                if (api) {
                    api.position.set(x, y, z);
                    api.velocity.set(0, 0, 0);
                }
            },

            tagCounter: 0,
            setTagCounter: (tagCounter) => set({ tagCounter }),

            tagCounter: 0,
            setTagCounter: (tagCounter) => set({ tagCounter }),

            bullets: [],
            addBullet: (bullet) => set((state) => ({ bullets: [...state.bullets, bullet] })),
            removeBullet: (id) => set((state) => ({ bullets: state.bullets.filter((b) => b.id !== id) })),

        }),
        {
            name: 'spleef-game-storage',
            version: 2,
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true)
            },
            partialize: (state) => ({
                // darkMode: state.darkMode,
            }),
        },
    ),
)