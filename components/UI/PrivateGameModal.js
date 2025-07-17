import { useState } from "react";

import { Modal } from "react-bootstrap"

// import powerups from "app/(site)/community/games/four-frogs/components/powerups";

import ArticlesSwitch from "@/components/UI/ArticlesSwitch";
import ArticlesButton from "@/components/UI/Button";

export default function FourFrogsPrivateGameModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [action, setAction] = useState('')

    const [room, setRoom] = useState('')

    const [powerupSettings, setPowerupSettings] = useState([...powerups.map(obj => ({
        ...obj,
        enabled: true
    }))])

    return (
        <>

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {

                    console.log("onExited")
                    setShow(false)
                    // setTimeout(() => setShow(false), 200);

                }}
                onHide={() => {

                    console.log("onHide")
                    setShowModal(false)

                    // if (!lightboxData) {
                    //     setShow(false)
                    // } else {
                    //     console.log("Should not close yet")
                    // }

                }}
            >



                <Modal.Header closeButton>
                    <Modal.Title>Private Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="">

                    <div>

                        <ArticlesButton
                            className={`w-50 ${action == 'Join' && 'active'}`}
                            onClick={() => {
                                setAction("Join")
                            }}
                        >
                            Join Private Game
                        </ArticlesButton>

                        <ArticlesButton
                            className={`w-50 ${action == 'Start' && 'active'}`}
                            onClick={() => {
                                setAction("Start")
                            }}
                        >
                            Start Private Game
                        </ArticlesButton>

                    </div>

                    {action &&
                        <div className="mt-2">
                            <hr />
                            <div>
                                {action} Options
                            </div>
                            <div className="form-group articles">
                                <label htmlFor="room-code">Room Code</label>
                                <input
                                    id="room-code"
                                    className="form-control"
                                    value={room}
                                    onChange={e => setRoom(e.target.value)}
                                >

                                </input>
                            </div>
                            <div className="small">At least 3 characters. Only letters, numbers, underscores (_), and dashes (-) can be used</div>
                        </div>
                    }

                    {action == 'Start' &&
                        <div className="mt-2">



                        </div>
                    }

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}

                    <ArticlesButton
                        variant="outline-dark"
                        onClick={() => {
                            setShowModal(false)
                        }}
                    >
                        Close
                    </ArticlesButton>

                    <ArticlesButton
                        variant="success"
                        onClick={() => {

                        }}
                        disabled={(room.length || 0) < 3}
                    >
                        Join
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}