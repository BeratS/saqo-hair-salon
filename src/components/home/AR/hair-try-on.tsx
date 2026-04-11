import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import Hairstyle from './hairstyle';
import { calculateRotation, lerp } from './pose-math';

const HAIR_STYLES = [
    { id: 'style1', name: 'Bald Fade', model: '/models/bald_head.glb' },
    { id: 'style2', name: 'Short Fade', model: '/models/fade.glb' },
    { id: 'style3', name: 'Classic Pomp', model: '/models/pomp.glb' },
];

export default function HairTryOn() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activeStyle, setActiveStyle] = useState(HAIR_STYLES[0]);
    const [transform, setTransform] = useState({
        pos: [0.5, 0.5, 0],
        rot: { pitch: 0, yaw: 0, roll: 0 },
        scale: 1
    });

    useEffect(() => {
        let faceLandmarker: any;
        let animationFrameId: number;

        const setupAR = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            
            faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: { 
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task` 
                },
                runningMode: "VIDEO",
                numFaces: 1
            });

            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user", width: 1280, height: 720 } 
            });
            
            if (videoRef.current) videoRef.current.srcObject = stream;

            const predict = () => {
                if (videoRef.current && videoRef.current.readyState >= 2) {
                    const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());

                    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                        const landmarks = results.faceLandmarks[0];
                        const newRot = calculateRotation(landmarks);

                        // Use Nose (1) for X/Z stability, Forehead (10) for Y height
                        const nose = landmarks[1];
                        const forehead = landmarks[10];

                        // Calculate stable scale based on cheek-to-cheek distance
                        const width = Math.sqrt(
                            Math.pow(landmarks[454].x - landmarks[234].x, 2) +
                            Math.pow(landmarks[454].y - landmarks[234].y, 2)
                        );

                        setTransform(prev => ({
                            pos: [
                                lerp(prev.pos[0], nose.x, 0.3), 
                                lerp(prev.pos[1], forehead.y, 0.3), 
                                lerp(prev.pos[2], nose.z, 0.3)
                            ],
                            rot: {
                                // Lower lerp (0.2) = smoother movement, less "drifting"
                                pitch: lerp(prev.rot.pitch, newRot.pitch, 0.2),
                                yaw: lerp(prev.rot.yaw, newRot.yaw, 0.2),
                                roll: lerp(prev.rot.roll, newRot.roll, 0.2),
                            },
                            scale: lerp(prev.scale, width, 0.2)
                        }));
                    }
                }
                animationFrameId = requestAnimationFrame(predict);
            };
            predict();
        };

        setupAR();
        return () => {
            cancelAnimationFrame(animationFrameId);
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-zinc-950 overflow-hidden">
            {/* Camera - Mirror effect applied via CSS */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ transform: 'scaleX(-1)' }}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* 3D Scene */}
            <div className="absolute inset-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.8} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    
                    <Hairstyle
                        url={activeStyle.model}
                        transform={transform} 
                    />
                </Canvas>
            </div>

            {/* Hairstyle Selector */}
            <div className="absolute bottom-10 left-0 w-full px-6 flex flex-col items-center gap-4">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full">
                    {HAIR_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setActiveStyle(style)}
                            className={cn(
                                "whitespace-nowrap px-8 py-4 rounded-[2rem] font-black uppercase tracking-tighter transition-all border-2",
                                activeStyle.id === style.id
                                    ? "bg-white text-zinc-900 border-white scale-105"
                                    : "bg-black/40 text-white border-white/20 backdrop-blur-md hover:bg-black/60"
                            )}
                        >
                            {style.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}