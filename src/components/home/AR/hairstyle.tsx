import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Hairstyle({ url, transform }: { url: string, transform: any }) {
    const { scene } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);

    return (
        <group 
            ref={groupRef}
            // We map the normalized MediaPipe coordinates (0 to 1) 
            // to Three.js coordinates (usually centered at 0)
            position={[
                (transform.pos[0] - 0.5) * -10, 
                (transform.pos[1] - 0.5) * -10, 
                (transform.pos[2]) * -5
            ]}
            rotation={[transform.rot.pitch, transform.rot.yaw, transform.rot.roll]}
            scale={transform.scale * 10}
        >
            <primitive object={scene} />
        </group>
    );
}

export default Hairstyle