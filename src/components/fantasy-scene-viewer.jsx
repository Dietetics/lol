import { useState, useRef, useEffect } from "react";
import fantasyImage1 from "../assets/lol.jpg";
import styles from "../styles/FantasySceneViewer.module.css";

export default function FantasySceneViewer() {
    const [isHovered, setIsHovered] = useState(false);
    const audioRef = useRef(null);
    const backgroundMusicRef = useRef(null);

    useEffect(() => {
        // Start background music when component mounts
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.volume = 0.3;
            backgroundMusicRef.current.play().catch(e => console.log("Background music play failed:", e));
        }

        // Cleanup on unmount
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (!isHovered) {
            setIsHovered(true);
            window.dispatchEvent(
                new CustomEvent("hoverAreaEntered", {
                    detail: { area: "fantasy-chamber-detail" },
                }),
            );

            // Stop background music when hovering
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }

            // Play door sound immediately with optimized settings
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 0.7;
                audioRef.current
                    .play()
                    .catch((e) => console.log("Audio play failed:", e));
            }
        }
    };

    const handleMouseLeave = () => {
        if (isHovered) {
            setIsHovered(false);
            window.dispatchEvent(
                new CustomEvent("hoverAreaLeft", {
                    detail: { area: "fantasy-chamber-detail" },
                }),
            );

            // Resume background music when not hovering
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.play().catch(e => console.log("Background music resume failed:", e));
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!isHovered) {
                handleMouseEnter();
                setTimeout(handleMouseLeave, 3000);
            }
        }
    };

    return (
        <div className="position-relative w-100 vh-100 d-flex align-items-center justify-content-center">
            <div
                className={`${styles.container} ${isHovered ? styles.sunlightActive : ""}`}
            >
                {/* Image de fond */}
                <img
                    src={fantasyImage1}
                    alt="Fantasy scene"
                    className={`${styles.sceneImage} ${styles.transitionFantasy} ${
                        isHovered ? styles.fantasyGlow : ""
                    }`}
                />

                {/* Sunlight effects removed */}

                {/* Focus overlay for blur effect */}
                <div
                    className={`${styles.focusOverlay} ${isHovered ? styles.fantasyGlow : ""}`}
                ></div>

                {/* SVG avec zone interactive */}
                <svg className={styles.svgOverlay} viewBox="0 0 1920 1080">
                    <path
                        d="M1344.6-20.4 861.6-19.8C831.8 8.5 811.4 47.4 797.4 85.7 762.6 197.3 763.4 326.1 744 471.5 735 582.77 726 694.03 717 805.3 722.4 849.7 745.3 899.6 803.2 923.9 813.7 926.07 824.2 928.23 834.7 930.4L1322.6 931C1405.3 911.3 1444.6 813.9 1439.7 695.2 1444.4 570.3 1426.7 445.73 1420.2 321 1395.53 207.33 1383 88.4 1346.8-20.4Z"
                        fill="rgba(255, 255, 255, 0.1)"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="2"
                        className={`${styles.hoverPath} ${isHovered ? styles.hoverPathActive : ""}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        role="button"
                        aria-label="Zone interactive"
                    />
                </svg>

                {/* Message indicateur */}
                <div
                    className={`${styles.hoverIndicator} ${
                        isHovered ? styles.hoverIndicatorVisible : ""
                    }`}
                >
                    <span>Hover Area Detected</span>
                </div>

                <audio
                    ref={audioRef}
                    preload="auto"
                    muted={false}
                    style={{ display: "none" }}
                    onCanPlayThrough={() => {
                        // Audio is ready to play without interruption
                        if (audioRef.current) {
                            audioRef.current.volume = 0.7;
                        }
                    }}
                >
                    <source src="/src/assets/door-open.wav" type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>

                <audio
                    ref={backgroundMusicRef}
                    preload="auto"
                    loop
                    muted={false}
                    style={{ display: "none" }}
                    onCanPlayThrough={() => {
                        // Background music is ready to play
                        if (backgroundMusicRef.current) {
                            backgroundMusicRef.current.volume = 0.3;
                        }
                    }}
                >
                    <source src="/src/assets/lol-select-music.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>

            {/* Glow ambiance */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ pointerEvents: "none" }}
            >
                <div className={styles.ambientGlow}></div>
            </div>
        </div>
    );
}
