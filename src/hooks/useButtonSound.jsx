
import { useRef } from 'react';
import buttonSoundFile from '../assets/videos/Voicy_Roblox_Button.mp3';

export const useButtonSound = () => {
    const buttonSoundRef = useRef(null);

    const playButtonSound = () => {
        if (buttonSoundRef.current) {
            try {
                buttonSoundRef.current.currentTime = 0;
                buttonSoundRef.current.volume = 0.6;
                
                // Check if audio is loaded before playing
                if (buttonSoundRef.current.readyState >= 2) {
                    buttonSoundRef.current
                        .play()
                        .catch((e) => {
                            // Only log if it's not a user interaction issue
                            if (e.name !== 'NotAllowedError') {
                                console.log("Button sound play failed:", e.message);
                            }
                        });
                }
            } catch (error) {
                console.log("Button sound error:", error.message);
            }
        }
    };

    const ButtonSoundElement = () => (
        <audio
            ref={buttonSoundRef}
            preload="auto"
            style={{ display: "none" }}
        >
            <source src={buttonSoundFile} type="audio/mpeg" />
        </audio>
    );

    return { playButtonSound, ButtonSoundElement };
};
