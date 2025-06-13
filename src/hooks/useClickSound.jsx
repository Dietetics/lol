
import { useRef } from 'react';
import clickSoundFile from '../assets/videos/Voicy_Button_Click.mp3';

export const useClickSound = () => {
    const clickSoundRef = useRef(null);

    const playClickSound = () => {
        if (clickSoundRef.current) {
            try {
                clickSoundRef.current.currentTime = 0;
                clickSoundRef.current.volume = 0.6;
                
                // Check if audio is loaded before playing
                if (clickSoundRef.current.readyState >= 2) {
                    clickSoundRef.current
                        .play()
                        .catch((e) => {
                            // Only log if it's not a user interaction issue
                            if (e.name !== 'NotAllowedError') {
                                console.log("Click sound play failed:", e.message);
                            }
                        });
                }
            } catch (error) {
                console.log("Click sound error:", error.message);
            }
        }
    };

    const ClickSoundElement = () => (
        <audio
            ref={clickSoundRef}
            preload="auto"
            style={{ display: "none" }}
        >
            <source src={clickSoundFile} type="audio/mpeg" />
        </audio>
    );

    return { playClickSound, ClickSoundElement };
};
