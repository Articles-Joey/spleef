import { useSphere } from "@react-three/cannon"
import { useEffect } from "react"
import { useSpleefGameStore } from "@/hooks/useSpleefGameStore"

export default function Bullet({ id, position, velocity }) {
    const removeBullet = useSpleefGameStore(state => state.removeBullet)
    
    const [ref] = useSphere(() => ({
        mass: 1,
        position,
        velocity,
        args: [0.2],
        type: 'Dynamic',
        onCollide: (e) => {
             // Despawn on impact
             // We can check e.body.userData to see if it hit a platform if needed
             // For now, any impact removes it
             removeBullet(id)
        }
    }))

    useEffect(() => {
        const timer = setTimeout(() => {
            removeBullet(id)
        }, 10000) // 10 seconds
        return () => clearTimeout(timer)
    }, [id, removeBullet])

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="black" />
        </mesh>
    )
}
