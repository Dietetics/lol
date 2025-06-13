import { useNavigate } from "react-router-dom";
import styles from "../styles/PageLayout.module.css";
import MilestoneComponent from "../components/Milestone";
import { useButtonSound } from "../hooks/useButtonSound";

export default function Milestone() {
    const navigate = useNavigate();
    const { playButtonSound, ButtonSoundElement } = useButtonSound();

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className={styles.pageContainer}>
            {ButtonSoundElement()}
            <div className={styles.pageContent}>
                <button className={styles.backButton} onClick={handleBackClick} onMouseEnter={playButtonSound}>
                    ← 返回主页
                </button>
                <h1 className={styles.pageTitle}>里程碑</h1>
                <MilestoneComponent />
            </div>
        </div>
    );
}
