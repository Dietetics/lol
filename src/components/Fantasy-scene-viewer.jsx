import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fantasyImage1 from "../assets/images/lol.jpg";
import doorOpenSound from "../assets/videos/door-open.wav";
import buttonSoundFile from "../assets/videos/Voicy_Roblox_Button.mp3";
import backgroundMusicFile from "../assets/videos/lol-welcome.mp3";
import styles from "../styles/FantasySceneViewer.module.css";
// Import all guild data statically
import badBoyzGuild from "../data/guilds/badBoyz.json";
import badBoyz2Guild from "../data/guilds/badBoyz2.json";
import badBoyz3Guild from "../data/guilds/badBoyz3.json";

export default function FantasySceneViewer() {
    const [isHovered, setIsHovered] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [currentGuildIndex, setCurrentGuildIndex] = useState(0);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [showContactValue, setShowContactValue] = useState(false);
    const audioRef = useRef(null);
    const backgroundMusicRef = useRef(null);
    const navigate = useNavigate();
    const buttonSoundRef = useRef(null); // Ref for button sound

    // Create guilds array from imported JSON files
    const guildsData = [
        badBoyzGuild,
        badBoyz2Guild,
        badBoyz3Guild
    ];

    const currentGuild = guildsData[currentGuildIndex];

    const navigateToNextGuild = () => {
        setCurrentGuildIndex((prevIndex) =>
            prevIndex === guildsData.length - 1 ? 0 : prevIndex + 1,
        );
        // Fermer le sous-menu quand on change de page
        setShowSubMenu(false);
        setShowContactValue(false);
    };

    const navigateToPrevGuild = () => {
        setCurrentGuildIndex((prevIndex) =>
            prevIndex === 0 ? guildsData.length - 1 : prevIndex - 1,
        );
        // Fermer le sous-menu quand on change de page
        setShowSubMenu(false);
        setShowContactValue(false);
    };

    const handleNavigateToSection = (section) => {
        // playSound(); // Play button sound on navigation - Removed from click
        navigate(`/${section}`, { 
            state: { 
                currentGuild: currentGuild.folder 
            }
        });
    };

    useEffect(() => {
        // Start background music when component mounts
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.volume = 0.3;
            backgroundMusicRef.current
                .play()
                .catch((e) => console.log("Background music play failed:", e));
        }

        // Cleanup on unmount
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (!isHovered && !isFrozen) {
            setIsHovered(true);
            setIsFrozen(true);
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
        // Ne fait rien - l'état reste figé une fois activé
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

        // Function to play button sound
        const playSound = () => {
            if (buttonSoundRef.current) {
                buttonSoundRef.current.currentTime = 0;
                buttonSoundRef.current.volume = 0.5;
                buttonSoundRef.current.play().catch(e => console.log("Button sound play failed:", e));
            }
        };

        const handleEnterClick = () => {
           // playSound(); //Removed play sound on click
            setShowSubMenu(true);
        };

    return (
        <div className="position-relative w-100 vh-100 d-flex align-items-center justify-content-center">
            <div
                className={`${styles.container} ${isHovered || isFrozen ? styles.sunlightActive : ""}`}
            >
                {/* Image de fond */}
                <img
                    src={fantasyImage1}
                    alt="Fantasy scene"
                    className={`${styles.sceneImage} ${styles.transitionFantasy} ${
                        isHovered || isFrozen ? styles.fantasyGlow : ""
                    }`}
                />

                {/* Sunlight effects removed */}

                {/* Focus overlay for blur effect */}
                <div
                    className={`${styles.focusOverlay} ${isHovered || isFrozen ? styles.fantasyGlow : ""}`}
                ></div>

                {/* SVG avec zone interactive */}
                <svg
                    className={styles.svgOverlay}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M70 0 L45 0 C43 2 42 5 41 8 C40 18 40 30 39 44 C38 54 38 64 37 75 C38 79 39 83 42 86 C43 86 43 86 44 86 L69 86 C73 84 75 75 75 65 C75 53 74 42 74 30 C73 19 72 8 70 0 Z"
                        fill="rgba(255, 255, 255, 0.1)"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="0.5"
                        className={`${styles.hoverPath} ${isHovered || isFrozen ? styles.hoverPathActive : ""}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        role="button"
                        aria-label="Zone interactive"
                    />
                </svg>

                {/* Rectangle avec contenu à l'intérieur de la zone SVG */}
                {(isHovered || isFrozen) && (
                    <div className={styles.svgContentBox}>
                        {/* Navigation arrows */}
                        <button
                            className={
                                styles.navArrow + " " + styles.navArrowLeft
                            }
                            onMouseEnter={() => { //Added hover sound
                                playSound();
                            }}
                            onClick={() => {
                                // playSound(); //removed click sound
                                navigateToPrevGuild();
                            }}
                            aria-label="Guilde précédente"
                        >
                            &lt;
                        </button>

                        <button
                            className={
                                styles.navArrow + " " + styles.navArrowRight
                            }
                            onMouseEnter={() => { //Added hover sound
                                playSound();
                            }}
                            onClick={() => {
                                // playSound();//removed click sound
                                navigateToNextGuild();
                            }}
                            aria-label="Guilde suivante"
                        >
                            &gt;
                        </button>

                        <h2 className={styles.contentTitle}>
                            {currentGuild.guild}
                        </h2>
                        <div className={styles.contentKeywords}>
                            <span className={styles.keyword}>
                                {currentGuild.zone}
                            </span>
                            <span 
                                className={`${styles.keyword} ${styles.contactKeyword}`}
                                onClick={() => {
                                    playSound();
                                    setShowContactValue(!showContactValue);
                                }}
                                onMouseEnter={() => {
                                    playSound();
                                }}
                            >
                                {showContactValue ? currentGuild.contact.value : currentGuild.contact.type}
                            </span>
                            <span className={styles.keyword}>
                                {currentGuild.members.length}/40
                            </span>
                        </div>
                        {!showSubMenu ? (
                            <button
                                className={styles.contentButton}
                                onClick={handleEnterClick}
                                onMouseEnter={() => { //Added hover sound
                                    playSound();
                                }}
                            >
                                进入
                            </button>
                        ) : (
                            <div className={styles.subMenuContainer}>
                                <button 
                                    className={styles.subMenuButton}
                                    onClick={() => handleNavigateToSection('milestone')}
                                    onMouseEnter={() => { //Added hover sound
                                        playSound();
                                    }}
                                >
                                    里程碑
                                </button>
                                <button 
                                    className={styles.subMenuButton}
                                    onClick={() => handleNavigateToSection('timeline')}
                                    onMouseEnter={() => { //Added hover sound
                                        playSound();
                                    }}
                                >
                                    时间线
                                </button>
                                <button 
                                    className={styles.subMenuButton}
                                    onClick={() => handleNavigateToSection('personnel')}
                                    onMouseEnter={() => { //Added hover sound
                                        playSound();
                                    }}
                                >
                                    人员变动
                                </button>
                                <button 
                                    className={styles.subMenuButton}
                                    onClick={() => handleNavigateToSection('rules')}
                                    onMouseEnter={() => { //Added hover sound
                                        playSound();
                                    }}
                                >
                                    盟规
                                </button>
                                <button 
                                    className={styles.backButton}
                                    onClick={() => {
                                       // playSound(); //removed click sound
                                        setShowSubMenu(false);
                                    }}
                                    onMouseEnter={() => { //Added hover sound
                                        playSound();
                                    }}
                                >
                                    ← 返回
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Message indicateur */}
                <div
                    className={`${styles.hoverIndicator} ${
                        isHovered || isFrozen
                            ? styles.hoverIndicatorVisible
                            : ""
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
                    <source src={doorOpenSound} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>

                {/* Button sound */}
                <audio
                    ref={buttonSoundRef}
                    preload="auto"
                    muted={false}
                    style={{ display: "none" }}
                >
                    <source src={buttonSoundFile} type="audio/mpeg" />
                    Your browser does not support the audio element.e audio element.
                </audio>

                <audio
                    ref={backgroundMusicRef}
                    preload="auto"
                    muted={false}
                    style={{ display: "none" }}
                    onCanPlayThrough={() => {
                        // Background music is ready to play
                        if (backgroundMusicRef.current) {
                            backgroundMusicRef.current.volume = 0.3;
                        }
                    }}
                >
                    <source
                        src={backgroundMusicFile}
                        type="audio/mpeg"
                    />
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