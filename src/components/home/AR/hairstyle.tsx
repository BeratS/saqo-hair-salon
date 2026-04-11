import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function Hairstyle({ url, transform }: { url: string, transform: any }) {
    const { scene } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);

    // Fine-tune these based on your specific .glb models
    const Y_OFFSET = 0.5; // Lift the hair up
    const Z_OFFSET = -0.2; // Move it slightly back into the head

    return (
        <group 
            ref={groupRef}
            // Multiplying by -10 to -15 stretches the 0.1 normalized movements 
            // to match the Three.js camera view
            position={[
                (transform.pos[0] - 0.5) * -12, 
                (transform.pos[1] - 0.5) * -12 + Y_OFFSET, 
                transform.pos[2] * -8 + Z_OFFSET
            ]}
            rotation={[
                transform.rot.pitch, 
                transform.rot.yaw, 
                transform.rot.roll
            ]}
            // Scale usually needs to be between 15-25 for head models
            scale={transform.scale * 22} 
        >
            <primitive object={scene} />
        </group>
    );
}