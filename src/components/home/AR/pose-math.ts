export const calculateRotation = (landmarks: any) => {
    // eyeRight (362), eyeLeft (33), nose (1), forehead (10), chin (152)
    const eyeRight = landmarks[362];
    const eyeLeft = landmarks[33];
    const nose = landmarks[1];
    const forehead = landmarks[10];
    const chin = landmarks[152];

    // ROLL: Angle between eyes
    const roll = Math.atan2(eyeRight.y - eyeLeft.y, eyeRight.x - eyeLeft.x);

    // YAW: Horizontal rotation
    const yaw = (Math.abs(nose.x - eyeLeft.x) - Math.abs(nose.x - eyeRight.x)) / 
                (Math.abs(eyeLeft.x - eyeRight.x));

    // PITCH: Vertical rotation
    const pitch = (Math.abs(forehead.y - nose.y) - Math.abs(nose.y - chin.y)) / 
                  (Math.abs(forehead.y - chin.y));

    return { 
        pitch: pitch * 1.2, 
        yaw: -yaw * 1.5, 
        roll: roll 
    };
};

// Simple Lerp function to stop the "jittering"
export const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
};