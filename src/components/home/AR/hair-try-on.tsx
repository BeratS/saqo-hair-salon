import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import Hairstyle from './hairstyle';
import { calculateRotation, lerp } from './pose-math';

const HAIR_STYLES = [
    { id: 'style1', name: 'Short Fade', model: '/models/fade.glb' },
    { id: 'style2', name: 'Curly Top', model: '/models/curly.glb' },
    { id: 'style3', name: 'Classic Pomp', model: '/models/pomp.glb' },
];

export default function HairTryOn() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [activeStyle, setActiveStyle] = useState(HAIR_STYLES[0]);
    const [transform, setTransform] = useState({
        pos: [0, 0, 0],
        rot: { pitch: 0, yaw: 0, roll: 0 },
        scale: 1
    });

    useEffect(() => {
        let faceLandmarker: any;
        let animationFrameId: number;

        const setupAR = async () => {
            // 1. Initialize MediaPipe
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
            faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task` },
                runningMode: "VIDEO",
                numFaces: 1
            });

            // 2. Setup Camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            if (videoRef.current) videoRef.current.srcObject = stream;

            // 3. Detection Loop
            const predict = () => {
                if (videoRef.current && videoRef.current.readyState >= 2) {
                    const results = faceLandmarker.detectForVideo(videoRef.current, performance.now());

                    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                        const landmarks = results.faceLandmarks[0];
                        const newRot = calculateRotation(landmarks);

                        // Forehead point (10) for position
                        const forehead = landmarks[10];

                        setTransform(prev => ({
                            pos: [forehead.x, forehead.y, forehead.z],
                            rot: {
                                pitch: lerp(prev.rot.pitch, newRot.pitch, 0.4),
                                yaw: lerp(prev.rot.yaw, newRot.yaw, 0.4),
                                roll: lerp(prev.rot.roll, newRot.roll, 0.4),
                            },
                            scale: Math.abs(landmarks[234].x - landmarks[454].x) // width between cheeks
                        }));
                    }
                }
                animationFrameId = requestAnimationFrame(predict);
            };
            predict();
        };

        setupAR();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="relative w-full h-screen bg-zinc-950 overflow-hidden">
            {/* The Raw Camera Feed */}
            <video
                ref={videoRef}
                autoPlay playsInline
                className="absolute inset-0 w-full h-full object-cover mirror"
            />

            {/* The 3D Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Hairstyle
                        url={activeStyle.model}
                        transform={transform} />
                </Canvas>
            </div>

            {/* Selection UI */}
            <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-6 px-6">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full">
                    {HAIR_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setActiveStyle(style)}
                            className={cn(
                                "whitespace-nowrap px-8 py-4 rounded-[2rem] font-black uppercase tracking-tighter transition-all",
                                activeStyle.id === style.id
                                    ? "bg-white text-zinc-900 scale-105 shadow-xl"
                                    : "bg-zinc-900/80 text-white border border-white/10 backdrop-blur-md"
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