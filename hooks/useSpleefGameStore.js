"use client"
// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
// import { nanoid } from 'nanoid'

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

export const useSpleefGameStore = create((set) => ({

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
    position: [0, 0, 0], // Initial sphere position
	setPlayer: (ref, api) => set({ ref, api }),
    setPosition: (position) => set({ position }),

    tagCounter: 0,
    setTagCounter: (tagCounter) => set({ tagCounter }),
}))