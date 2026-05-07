import { useFrame, useThree } from "@react-three/fiber"
import { useCompoundBody } from "@react-three/cannon"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { Vector3 } from "three"
import { useKeyboard } from "@/hooks/useKeyboard"

// import { useTagGameStore } from "@/hooks/useTagGameStore"
import { useSpleefGameStore } from '@/hooks/useSpleefGameStore';

import { usePeerStore } from "@/hooks/usePeerStore"
// import { useStore } from "@/hooks/useStore"

// import Duck from "../Models/Duck"
import SpacesuitModel from "../Models/Spacesuit"
import ModelBazooka from "../Models/Bazooka"
// import axios from "axios"
import { degToRad } from "three/src/math/MathUtils"

const JUMP_FORCE = 4;
const SPEED = 4;
const CONTROLLER_DEADZONE = 0.15;
const LOOK_SENSITIVITY = 0.04;

function PlayerBase() {

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift, crouch, cameraView } = useKeyboard()

    const [action, setAction] = useState("Idle")
    const [speed, setSpeed] = useState(1)
    const [isJumping, setIsJumping] = useState(false)

    const audioSettings = useSpleefGameStore((state) => state.audioSettings)
    const itPlayerId = usePeerStore(state => state.gameState?.itPlayerId)
    const peer = usePeerStore(state => state.peer)

    const walkAudio = useRef(typeof Audio !== "undefined" ? new Audio("/audio/walk.ogg") : null)
    const runAudio = useRef(typeof Audio !== "undefined" ? new Audio("/audio/run.ogg") : null)
    const tagAudio = useRef(typeof Audio !== "undefined" ? new Audio("/audio/tag.ogg") : null)

    const prevItPlayerId = useRef(null)

    useEffect(() => {
        if(walkAudio.current) walkAudio.current.loop = true
        if(runAudio.current) runAudio.current.loop = true
        
        return () => {
             walkAudio.current?.pause();
             runAudio.current?.pause();
        }
    }, [])

    useEffect(() => {
        if (!audioSettings?.enabled) return;

        const volume = audioSettings.soundEffectsVolume !== undefined ? (audioSettings.soundEffectsVolume / 100) : 0.5;
        
        if(walkAudio.current) walkAudio.current.volume = volume;
        if(runAudio.current) runAudio.current.volume = volume;
        if(tagAudio.current) tagAudio.current.volume = volume;
    }, [audioSettings?.soundEffectsVolume, audioSettings?.enabled])

    useEffect(() => {
        if (!audioSettings?.enabled) {
             walkAudio.current?.pause();
             runAudio.current?.pause();
             return;
        }

        // Mute if jumping
        if (isJumping) {
            walkAudio.current?.pause();
            runAudio.current?.pause();
            return;
        }

        if (action === "Walk") {
             runAudio.current?.pause();
             if (walkAudio.current?.paused) walkAudio.current.play().catch(()=>{});
        } else if (action === "Run") {
             walkAudio.current?.pause();
             if (runAudio.current?.paused) runAudio.current.play().catch(()=>{});
        } else {
             walkAudio.current?.pause();
             runAudio.current?.pause();
        }
    }, [action, isJumping, audioSettings?.enabled])

    // Detect being tagged
    useEffect(() => {
        if (!audioSettings?.enabled) return;
        
        if (itPlayerId && peer?.id && itPlayerId === peer.id && prevItPlayerId.current !== itPlayerId) {
             // We just became IT
             tagAudio.current.currentTime = 0;
             tagAudio.current.play().catch(()=>{});
        }
        prevItPlayerId.current = itPlayerId;

    }, [itPlayerId, peer?.id, audioSettings?.enabled])
    
    // Controller specific refs
    const prevToggleView = useRef(false);

    // Standard Gamepad Mapping (Xbox 360 / One / DualShock)
    // 0: A/Cross, 1: B/Circle, 2: X/Square, 3: Y/Triangle
    // 6: LT/L2, 7: RT/R2

    useEffect(() => {
        if (isJumping) return;
        // Gamepad polling is done in useFrame, this effect mainly handles keyboard state for Action
        // We'll update this slightly to trust the velocity or movement flag instead of just keyboard keys
        // But for now, let's keep it responding to logic.
        
        if (moveLeft || moveRight || moveBackward || moveForward) {
            if (shift) {
                setAction("Run");
            } else {
                setAction("Walk");
            }
        } else {
            setAction("Idle");
        }
    }, [moveBackward, moveForward, moveRight, moveLeft, isJumping, shift])

    const [isThirdPerson, setIsThirdPerson] = useState(false)

    useEffect(() => {
        if (cameraView) setIsThirdPerson((prev) => !prev)
    }, [cameraView])

    const { camera } = useThree()

    useEffect(() => {
        // Ensure camera looks forward on spawn
        camera.rotation.set(0, 0, 0, 'YXZ') // Set Rotation Order to YXZ for FPS style
    }, [camera])

    const modelRef = useRef()
    const hudGroupRef = useRef()
    const weaponRef = useRef()
    const hudOffset = useMemo(() => new Vector3(0.6, -0.45, -1.2), [])
    const hudOffsetApplied = useMemo(() => new Vector3(), [])
    const hudWorldPosition = useMemo(() => new Vector3(), [])
    
    // Track how many frames we've been "still" vertically to detect ground vs apex
    const groundedFrames = useRef(0)

    const [ref, api] = useCompoundBody(() => {
        // Recover last known position from store if available to prevent reset on re-render
        const lastPos = useSpleefGameStore.getState().position;
        // If lastPos is [0,0,0] (default store state), use spawn point [0,1,0]
        // Otherwise use the stored position
        const spawnPos = (lastPos[0] === 0 && lastPos[1] === 0 && lastPos[2] === 0) 
            ? [7, 40, 7] 
            : lastPos;

        return {
            mass: 1,
            type: 'Dynamic',
            position: spawnPos,
            fixedRotation: true,
            angularDamping: 1,
            shapes: [
                { type: 'Sphere', args: [0.3], position: [0, 0.15, 0] },
                { type: 'Sphere', args: [0.3], position: [0, -0.15, 0] },
                { type: 'Cylinder', args: [0.3, 0.3, 0.3, 8], position: [0, 0, 0] }
            ],
            onCollide: (c) => {
                if (c.body.userData.isGround) {
                    console.log("GG!")
                    useSpleefGameStore.getState().setAlive(false)

                    let currentSurvivalTime = useSpleefGameStore.getState().survivalTimer
                    let best = useSpleefGameStore.getState().bestSurvivalTimer

                    if (currentSurvivalTime > best) {
                        useSpleefGameStore.getState().setBestSurvivalTimer(currentSurvivalTime)

                        // TODO: re-enable when user auth is available
                        // if (userReduxState?._id) {
                        //     axios.post('/api/user/community/games/scoreboard/set', {
                        //         game: 'Spleef',
                        //         value: +currentSurvivalTime
                        //     }).then(r => console.log(r.data)).catch(r => console.log(r.data))
                        // }
                    }
                }
            }
        }
    })

    const setPlayer = useSpleefGameStore((state) => state.setPlayer);
    const setPosition = useSpleefGameStore((state) => state.setPosition);
    const setRotation = useSpleefGameStore((state) => state.setRotation);
    const setActionStore = useSpleefGameStore((state) => state.setAction);
    const setSprintEnergy = useSpleefGameStore((state) => state.setSprintEnergy);
    const alive = useSpleefGameStore((state) => state.alive);
    const setAlive = useSpleefGameStore((state) => state.setAlive);
    const incrementSurvivalTimer = useSpleefGameStore((state) => state.incrementSurvivalTimer);
    const setBestSurvivalTimer = useSpleefGameStore((state) => state.setBestSurvivalTimer);
    const bestSurvivalTimer = useSpleefGameStore((state) => state.bestSurvivalTimer);
    const addBullet = useSpleefGameStore((state) => state.addBullet);

    useEffect(() => {
        setActionStore(action);
    }, [action, setActionStore]);

    // Shoot bullet on mouse click
    useEffect(() => {
        const handleMouseDown = () => {

            // if (!alive) return

            const direction = new Vector3()
            camera.getWorldDirection(direction)
            
            const spawnPos = new Vector3()

            if (isThirdPerson) {
                // Spawn from player body position to avoid intersecting the model
                spawnPos.set(pos.current[0], pos.current[1], pos.current[2])
                spawnPos.add(direction.clone().multiplyScalar(1)) // Push slightly in look direction
            } else {
                camera.getWorldPosition(spawnPos)
                spawnPos.add(direction.clone().multiplyScalar(2)) // Spawn slightly in front of camera
            }

            const velocity = direction.multiplyScalar(30) // Speed 30

            addBullet({
                id: Date.now() + Math.random(),
                position: [spawnPos.x, spawnPos.y, spawnPos.z],
                velocity: [velocity.x, velocity.y, velocity.z]
            })
        }

        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [alive, addBullet, camera, isThirdPerson])

    // Survival timer
    useEffect(() => {
        let interval;

        if (alive) {
            interval = setInterval(() => {
                incrementSurvivalTimer();
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [alive, incrementSurvivalTimer])

    useEffect(() => {
        // Save ref and api to the store
        setPlayer(ref, api);

        // Subscribe to the position updates
        const unsubscribe = api.position.subscribe((position) => {
            setPosition([...position]); // Update position in the store
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [ref, api, setPlayer, setPosition]);

    const vel = useRef([0, 0, 0])
    useEffect(() => {

        const unsubscribe = api.velocity.subscribe((v) => vel.current = v)
        return () => unsubscribe();

    }, [api.velocity])

    const pos = useRef([0, 0, 0])

    useEffect(() => {

        const unsubscribe = api.position.subscribe((p) => pos.current = p)
        return () => unsubscribe();

    }, [api.position])

    useEffect(() => {
        console.log("Shift", shift)
    }, [shift])

    const sprintEnergy = useRef(5)
    const lastSprintTime = useRef(0)
    const lastJumpTime = useRef(0)
    const lastForwardPressTime = useRef(0)
    const isDoubleTapSprinting = useRef(false)
    const wasMovingForward = useRef(false)

    useFrame((state, delta) => {

        // return

        // camera.position.copy(new Vector3(pos.current[0], (pos.current[1] / (crouch ? 2 : 1)), pos.current[2]))

        // Update the camera position using the global state
        if (isThirdPerson) {
            const cameraDirection = new Vector3()
            camera.getWorldDirection(cameraDirection)

            const targetPos = new Vector3(
                pos.current[0],
                (pos.current[1] / (crouch ? 2 : 1)) + 0.5,
                pos.current[2]
            )

            const offset = cameraDirection.clone().multiplyScalar(-4)

            camera.position.copy(targetPos).add(offset)
        } else {
            camera.position.copy(
                new Vector3(
                    pos.current[0],
                    (pos.current[1] / (crouch ? 2 : 1)) + 0.4, // Adjust height for crouch, +2 units higher default
                    pos.current[2]
                )
            );
        }

        // console.log(pos)

        const direction = new Vector3()

        // Get Gamepad Input
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0]; // Assume first controller

        let forwardInput = (moveBackward ? 1 : 0) - (moveForward ? 1 : 0);
        let sideInput = (moveLeft ? 1 : 0) - (moveRight ? 1 : 0);

        if (moveForward && !wasMovingForward.current) {
            if (Date.now() - lastForwardPressTime.current < 300) {
                isDoubleTapSprinting.current = true;
            }
            lastForwardPressTime.current = Date.now();
        }
        if (!moveForward) isDoubleTapSprinting.current = false;
        wasMovingForward.current = moveForward;

        let isSprintingInput = shift || isDoubleTapSprinting.current;
        let isJumpingInput = jump;
        
        let rotationX = 0;
        let rotationY = 0;

        if (gamepad) {
            // Left Stick (Movement) - Axes 0, 1
            const axisX = gamepad.axes[0];
            const axisY = gamepad.axes[1];
            
            if (Math.abs(axisX) > CONTROLLER_DEADZONE) sideInput -= axisX; // Inverted X axis
            if (Math.abs(axisY) > CONTROLLER_DEADZONE) forwardInput += axisY;

            // Right Stick (Look) - Axes 2, 3
            const lookX = gamepad.axes[2];
            const lookY = gamepad.axes[3];

            if (Math.abs(lookX) > CONTROLLER_DEADZONE) rotationY -= lookX * LOOK_SENSITIVITY;
            if (Math.abs(lookY) > CONTROLLER_DEADZONE) rotationX -= lookY * LOOK_SENSITIVITY;

            // Buttons
            // Button 0: A (Jump)
            if (gamepad.buttons[0].pressed) isJumpingInput = true;
            
            // Button 7: RT (Sprint)
            if (gamepad.buttons[7] && (gamepad.buttons[7].pressed || gamepad.buttons[7].value > 0.1)) {
                isSprintingInput = true;
            }

            // Button 3: Y (Toggle View)
            if (gamepad.buttons[3].pressed) {
                if (!prevToggleView.current) {
                    setIsThirdPerson(p => !p);
                    prevToggleView.current = true;
                }
            } else {
                prevToggleView.current = false;
            }
        }

        // Apply Camera Rotation from Controller
        if (rotationX !== 0 || rotationY !== 0) {
            camera.rotation.y += rotationY;
            camera.rotation.x += rotationX;
            // Clamp Pitch
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        }

        const frontVector = new Vector3(0, 0, forwardInput);
        const sideVector = new Vector3(sideInput, 0, 0);

        const isMoving = frontVector.length() > 0 || sideVector.length() > 0
        const isSprinting = isSprintingInput && isMoving && sprintEnergy.current > 0

        // Determine animation state if using controller (since useEffect above only checks keys)
        if (isMoving && !isJumping) {
            if (action !== "Run" && action !== "Walk") {
               // This is a quick fix to sync animation state with controller. 
               // Ideally we move the logic from useEffect to here completely.
               setAction(isSprinting ? "Run" : "Walk");
            } else if (isSprinting && action === "Walk") {
                setAction("Run");
            } else if (!isSprinting && action === "Run") {
                setAction("Walk");
            }
        } else if (!isMoving && !isJumping && action !== "Idle") {
             setAction("Idle");
        }

        if (isSprinting) {
            sprintEnergy.current = Math.max(0, sprintEnergy.current - delta)
            lastSprintTime.current = Date.now()
        } else {
            const { gameState, peer } = usePeerStore.getState();
            // If we are "IT", we recover stamina faster (2s vs 3s)
            const isIt = gameState?.itPlayerId && peer?.id && gameState.itPlayerId === peer.id;
            const recoveryCooldown = isIt ? 2000 : 3000;

            if (Date.now() - lastSprintTime.current > recoveryCooldown) {
                sprintEnergy.current = Math.min(5, sprintEnergy.current + delta)
            }
        }

        setSprintEnergy(sprintEnergy.current)

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED * (isSprinting ? 2 : 1))
            .applyEuler(camera.rotation)

        if (isMoving) {
            // Calculate rotation based on movement direction
            // Math.atan2(x, z) gives the angle relative to "Forward" (Z-axis)
            // Adjust depending on model orientation. Usually models face +Z or -Z.
            // If the model faces +Z, and we move +Z (Backward), atan2(0, 1) = 0.
            // If we move -Z (Forward), atan2(0, -1) = PI.
            // We'll trust atan2 gives the correct yaw angle for the world velocity.
            const rotation = Math.atan2(direction.x, direction.z);
            if (modelRef.current) {
                // Check if we have significant movement to avoid jitter
                if (Math.abs(direction.x) > 0.001 || Math.abs(direction.z) > 0.001) {
                    modelRef.current.rotation.y = rotation
                    setRotation(rotation)
                }
            }
        }

        // Boundary Checks (Prevent going past -85 and 85)
        if (pos.current[0] > 85 && direction.x > 0) direction.x = 0;
        if (pos.current[0] < -85 && direction.x < 0) direction.x = 0;
        if (pos.current[2] > 85 && direction.z > 0) direction.z = 0;
        if (pos.current[2] < -85 && direction.z < 0) direction.z = 0;

        api.velocity.set(direction.x, vel.current[1], direction.z)

        // Check if grounded (low vertical velocity for multiple frames)
        if (Math.abs(vel.current[1]) < 0.1) {
            groundedFrames.current += 1
        } else {
            groundedFrames.current = 0
        }

        // Handle Landing
        if (isJumping && groundedFrames.current > 4 && Date.now() - lastJumpTime.current > 500) {
            setIsJumping(false)
            setSpeed(1)
        }

        // Jump if grounded for at least 3 frames (avoids apex jumping)
        // !isJumping check to prevent double jump logic
        if (isJumpingInput && groundedFrames.current > 2 && !isJumping) {
            api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
            groundedFrames.current = 0

            // Play Run animation at 3x speed for 1 second to simulate jump
            setIsJumping(true)
            setAction("Run")
            setSpeed(3)
            lastJumpTime.current = Date.now()
        }

        if (modelRef.current) {
            modelRef.current.position.set(pos.current[0], pos.current[1], pos.current[2])
        }

        // HUD: keep weapon model attached to camera
        const hud = hudGroupRef.current
        if (hud) {
            hudOffsetApplied
                .copy(hudOffset)
                .applyQuaternion(camera.quaternion)

            hudWorldPosition
                .copy(camera.position)
                .add(hudOffsetApplied)

            hud.position.copy(hudWorldPosition)
            hud.quaternion.copy(camera.quaternion)
        }

    })

    return (
        <>
            <mesh ref={ref} />
            <group ref={modelRef} visible={isThirdPerson}>

                {/* <Duck /> */}

                <SpacesuitModel
                    scale={0.5}
                    position={[0, -0.45, 0]}
                    action={action}
                    speed={speed}
                />

            </group>

            {/* HUD: weapon model rendered in player's view */}
            <group ref={hudGroupRef} scale={0.25}>
                <group ref={weaponRef}>
                    <ModelBazooka 
                        scale={3}
                        rotation={[0, 0, degToRad(-90)]}
                        hud
                    />
                </group>
            </group>
        </>
    )
}

const MemoizedPlayer = memo(PlayerBase);

export const Player = MemoizedPlayer;