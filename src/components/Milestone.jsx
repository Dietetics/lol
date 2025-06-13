import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/Milestone.module.css";

// Import all personnel data statically
import badBoyzPersonnel from "../data/badBoyz/Personnel.json";
import badBoyz2Personnel from "../data/badBoyz2/Personnel.json";
import badBoyz3Personnel from "../data/badBoyz3/Personnel.json";

export default function Milestone() {
    // Get the current guild from URL params or default to 'badBoyz'
    const location = useLocation();
    const currentGuild = location.state?.currentGuild || 'badBoyz';

    // Map guild folders to their personnel data
    const personnelDataMap = {
        "badBoyz": badBoyzPersonnel,
        "badBoyz2": badBoyz2Personnel,
        "badBoyz3": badBoyz3Personnel,
    };

    // Get personnel data for current guild or default
    const personnelData = personnelDataMap[currentGuild] || [];

    // Extract milestones from personnel data (选手 and 荣耀)
    const milestones = personnelData.map(player => ({
        player: player.选手,
        achievements: player.荣耀 || []
    }));

    return (
        <div className={styles.milestoneContainer}>
            <div className={styles.milestoneHeader}>
                <h2 className={styles.title}>里程碑</h2>
                <p className={styles.subtitle}>联盟成员荣耀记录</p>
            </div>

            <div className={styles.milestoneContent}>
                {milestones.map((milestone, playerIndex) => (
                    <div key={playerIndex} className={styles.playerSection}>
                        <h3 className={styles.playerName}>{milestone.player}</h3>
                        <div className={styles.achievementsList}>
                            {milestone.achievements.map((achievement) => (
                                <div key={achievement.id} className={styles.achievementItem}>
                                    <div className={styles.achievementNumber}>#{achievement.id}</div>
                                    <div className={styles.achievementContent}>
                                        <h4 className={styles.achievementTitle}>{achievement.title}</h4>
                                        <p className={styles.achievementDescription}>{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}