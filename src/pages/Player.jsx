
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/PageLayout.module.css";
import PlayerComponent from "../components/Player";
import { useButtonSound } from "../hooks/useButtonSound";

export default function Player() {
    const navigate = useNavigate();
    const location = useLocation();
    const { playButtonSound, ButtonSoundElement } = useButtonSound();
    const [playerData, setPlayerData] = useState(null);

    useEffect(() => {
        // Get player data from navigation state
        if (location.state?.playerData) {
            setPlayerData(location.state.playerData);
        } else {
            // If no player data, redirect back to personnel
            navigate("/personnel");
        }
    }, [location.state, navigate]);

    const handleBackClick = () => {
        navigate("/personnel");
    };

    if (!playerData) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.pageContent}>
                    <p>正在加载选手信息...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {ButtonSoundElement()}
            <div className={styles.pageContent}>
                <button
                    className={styles.backButton}
                    onClick={handleBackClick}
                    onMouseEnter={playButtonSound}
                >
                    ← 返回人员页面
                </button>
                <PlayerComponent playerData={playerData} />
            </div>
        </div>
    );
}
