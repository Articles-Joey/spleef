"use client";
import { useSpleefGameStore } from '@/hooks/useSpleefGameStore';
// import { useStore } from '@/hooks/useStore';
import dynamic from 'next/dynamic'

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@/components/UI/CreditsModal'),
    { ssr: false }
)

export default function GlobalClientModals() {

    const showInfoModal = useSpleefGameStore((state) => state.showInfoModal)
    const setShowInfoModal = useSpleefGameStore((state) => state.setShowInfoModal)

    const showSettingsModal = useSpleefGameStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useSpleefGameStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useSpleefGameStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useSpleefGameStore((state) => state.setShowCreditsModal)

    return (
        <>
            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            }
        </>
    )
}