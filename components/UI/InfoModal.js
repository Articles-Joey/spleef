import { useEffect, useState } from "react";

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import { useStore } from "@/hooks/useStore";

export default function GameInfoModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    const darkMode = useStore(state => state.darkMode)

    return (
        <>

            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className="ratio ratio-16x9">
                        {darkMode ?
                            <img src={"img/background-dark.webp"}></img>
                            :
                            <img src={"img/background.webp"}></img>
                        }
                    </div>

                    <div className="p-3">

                        <div className="fw-bold mb-2">
                            Spleef
                        </div>

                        <div className="">
                            Stay in the game longer then all the other players. Each platform disappears shortly after you land on it. Jump platform to platform to avoid falling down the different levels, if you fall all the way through you will be eliminated.
                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}