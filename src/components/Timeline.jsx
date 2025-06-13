import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Timeline.module.css';
import { useClickSound } from '../hooks/useClickSound';

// Import all timeline data statically
import badBoyzTimeline from "../data/badBoyz/Timeline.json";
import badBoyz2Timeline from "../data/badBoyz2/Timeline.json";
import badBoyz3Timeline from "../data/badBoyz3/Timeline.json";

export default function Timeline() {
    // Get the current guild from URL params or default to 'badBoyz'
    const location = useLocation();
    const currentGuild = location.state?.currentGuild || 'badBoyz';
    const { playClickSound, ClickSoundElement } = useClickSound();

    // Map guild folders to their timeline data
    const timelineDataMap = {
        "badBoyz": badBoyzTimeline,
        "badBoyz2": badBoyz2Timeline,
        "badBoyz3": badBoyz3Timeline,
    };

    // Get timeline data for current guild or default
    const timelineData = timelineDataMap[currentGuild] || { 
        allianceName: 'Alliance inconnue', 
        timeline: [] 
    };

    return (
        <div className={styles.timelineContainer}>
            <div className={styles.timelineHeader}>
                <h2 className={styles.allianceName}>{timelineData.allianceName}</h2>
                <p className={styles.subtitle}>Alliance Timeline</p>
            </div>

            <div className={styles.timelineContent}>
                {timelineData.timeline.map((event, index) => (
                    <div 
                        key={index} 
                        className={styles.timelineItem}
                        onMouseEnter={playClickSound}
                    >
                        <div className={styles.timelineDate}>
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className={styles.timelineEvent}>
                            <h3 className={styles.eventTitle}>{event.event}</h3>
                            <p className={styles.eventDescription}>{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Audio element for click sound */}
            <ClickSoundElement />
        </div>
    );
}