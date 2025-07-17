import { useSocketStore } from "@/hooks/useSocketStore"
import { useCylinder } from "@react-three/cannon"
import { useSearchParams } from "next/navigation"
import { memo, useEffect, useState } from "react"
import getRandomHexColor from "@/util/getRandomHexColor"

function Level({ level_i }) {

    return (
        <group>

            {[...Array(10)].map((obj, row_i) => {

                let offset = 0

                if (row_i % 2 == 1) {
                    offset = 0.9
                }

                return (
                    <group key={row_i}>

                        {[...Array(10)].map((obj, col_i) => {
                            return (
                                <Tile
                                    key={`${row_i}-${col_i}`}
                                    position_id={`${row_i}-${col_i}`}
                                    level_id={level_i}
                                    position={[(offset + (col_i * 1.8)), (level_i * 5), (row_i * 1.8)]}
                                />
                            )
                        })}

                    </group>
                )
            })}

        </group>
    )

}

export default memo(Level)

function Tile({ position, position_id, level_id }) {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server } = searchParamsObject

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const [touched, setTouched] = useState(false);
    const [removed, setRemoved] = useState(false);

    const args = [1, 1, 0.5, 6]

    const [ref, api] = useCylinder(() => ({
        mass: 0,
        type: 'Static',
        args: args,
        position: position,
        onCollide: (c) => {
            console.log("Player touched a Tile", c.body.userData)
            // api.position.set(0, -100, 0);
            setTouched(true)
            
            if (server && socket) {
                socket.emit(
                    'game:spleef:platform-triggered',
                    {
                        server,
                        position_id,
                        level_id
                    }
                )
            }
        }
    }))

    // Disable physics when touched is true
    useEffect(() => {
        if (touched) {
            setTimeout(() => {
                setRemoved(true)
            }, 1000)
        }
    }, [touched]);

    useEffect(() => {
        if (removed) {
            console.log("Removed")
            // api.collisionFilterMask.set(0);
            api.position.set(0, -10, 0);
        }
    }, [removed, api]);

    // if (removed) return

    return (
        <mesh ref={ref} castShadow>

            {!removed &&
                <>
                    <cylinderGeometry args={args} />
                    {/* <BeachBall /> */}
                    <meshStandardMaterial
                        color={getRandomHexColor()}
                        transparent={true}
                        opacity={touched ? 0.5 : 1}
                    />
                </>
            }

        </mesh>
    )

}