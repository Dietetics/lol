import { useNavigate } from "react-router-dom";
import styles from "../styles/PageLayout.module.css";
import RulesComponent from "../components/Rules";
import { useButtonSound } from "../hooks/useButtonSound";

export default function Rules() {
    const navigate = useNavigate();
    const { playButtonSound, ButtonSoundElement } = useButtonSound();

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className={styles.pageContainer}>
            {ButtonSoundElement()}
            <div className={styles.pageContent}>
                <button
                    className={styles.backButton}
                    onClick={handleBackClick}
                    onMouseEnter={playButtonSound}
                >
                    ← 返回主页
                </button>
                <h1 className={styles.pageTitle}>📜盟规📜</h1>
                <div className={styles.decorativeLine}></div>
                <RulesComponent />
            </div>
        </div>
    );
}
