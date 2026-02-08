import { useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";

export default function FourFrogsSettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Controls')

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                // centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Controls',
                            'Audio',
                            'Chat'
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">
                        {tab == 'Controls' &&
                            <div>
                                {[
                                    {
                                        action: 'Move Up',
                                        defaultKeyboardKey: 'W',
                                        defaultControllerKey: 'Left Stick Up',
                                    },
                                    {
                                        action: 'Move Down',
                                        defaultKeyboardKey: 'S',
                                        defaultControllerKey: 'Left Stick Down',
                                    },
                                    {
                                        action: 'Move Left',
                                        defaultKeyboardKey: 'A',
                                        defaultControllerKey: 'Left Stick Left',
                                    },
                                    {
                                        action: 'Move Right',
                                        defaultKeyboardKey: 'D',
                                        defaultControllerKey: 'Left Stick Right',
                                    },
                                    {
                                        action: 'Look Around',
                                        defaultKeyboardKey: 'Mouse Move',
                                        defaultControllerKey: 'Right Stick',
                                        disableChange: true,
                                    },
                                    {
                                        action: 'Sprint',
                                        defaultKeyboardKey: 'Shift',
                                        defaultControllerKey: 'RT',
                                    },
                                    {
                                        action: 'Jump',
                                        defaultKeyboardKey: 'Space',
                                        defaultControllerKey: 'A',
                                    },
                                    {
                                        action: 'Camera Control Toggle',
                                        defaultKeyboardKey: 'V',
                                        defaultControllerKey: 'Y',
                                    },
                                ].map(obj =>
                                    <div key={obj.action}>
                                        <div className="flex-header border-bottom pb-1 mb-1">

                                            <div>
                                                <div>{obj.action}</div>
                                                {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                            </div>

                                            <div>

                                                <div className="badge badge-hover bg-articles me-1">{obj.defaultKeyboardKey}</div>

                                                <ArticlesButton
                                                    className=""
                                                    small
                                                >
                                                    Change Key
                                                </ArticlesButton>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }

                        {tab == 'Audio' &&
                            <AudioTab />
                        }

                        {tab == 'Chat' &&
                            <ChatTab />
                        }

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}

                    <div>

                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            variant="outline-danger ms-3"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>
        </>
    )

}

function AudioTab() {

    const audioSettings = useSpleefGameStore((state) => state.audioSettings)
    const setAudioSettings = useSpleefGameStore((state) => state.setAudioSettings)

    return (
        <>

            <div className="mb-3">
                <ArticlesButton
                    active={!audioSettings?.enabled}
                    onClick={() => {
                        setAudioSettings({
                            ...audioSettings,
                            enabled: false,
                        })
                    }}
                >
                    Off
                </ArticlesButton>
                <ArticlesButton
                    active={audioSettings?.enabled}
                    onClick={() => {
                        setAudioSettings({
                            ...audioSettings,
                            enabled: true,
                        })
                    }}
                >
                    On
                </ArticlesButton>
            </div>

            <Form.Label className="mb-0">Game Volume - {audioSettings?.soundEffectsVolume}</Form.Label>
            <Form.Range
                value={audioSettings?.soundEffectsVolume}
                onChange={(e) => setAudioSettings({
                    ...audioSettings,
                    soundEffectsVolume: Number(e.target.value),
                })}
            />
            <Form.Label className="mb-0">Music Volume - {audioSettings?.backgroundMusicVolume}</Form.Label>
            <Form.Range
                value={audioSettings?.backgroundMusicVolume}
                onChange={(e) => setAudioSettings({
                    ...audioSettings,
                    backgroundMusicVolume: Number(e.target.value),
                })}
            />
        </>
    )
}

function ChatTab() {
    return (
        <>
            <Form.Check
                type="switch"
                id="custom-switch"
                label="Game chat panel"
            />
            <Form.Check
                type="switch"
                id="custom-switch"
                label="Censor chat"
            />
            <Form.Check
                type="switch"
                id="custom-switch"
                label="Game chat speech bubbles"
            />
        </>
    )
}