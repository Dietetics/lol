import { useNavigate } from "react-router-dom";
import styles from "../styles/PageLayout.module.css";
import PersonnelComponent from "../components/Personnel";
import { useButtonSound } from "../hooks/useButtonSound";

export default function Personnel() {
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
                <PersonnelComponent />
            </div>
        </div>
    );
}
