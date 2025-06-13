
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/Rules.module.css";
import { useGuildData } from "../hooks/useGuildData";

export default function Rules() {
    // Get the current guild from URL params or default to 'badBoyz'
    const location = useLocation();
    const currentGuild = location.state?.currentGuild || 'badBoyz';
    const [rulesFiles, setRulesFiles] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [selectedDevSection, setSelectedDevSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVersionSelectorVisible, setIsVersionSelectorVisible] = useState(false);
    
    // Use dynamic guild data hook
    const { guildData, loading: guildLoading, error } = useGuildData(currentGuild);

    // Function to extract date from filename (e.g., "5.10.json" -> "5.10")
    const getDateFromFilename = (filename) => {
        return filename.replace('.json', '');
    };

    // Function to parse date for sorting (assuming MM.DD format)
    const parseDate = (dateStr) => {
        const [month, day] = dateStr.split('.').map(Number);
        return new Date(2024, month - 1, day); // Using 2024 as base year
    };

    // Load all rules files dynamically
    useEffect(() => {
        const loadRulesFiles = async () => {
            if (guildLoading || !guildData) {
                setLoading(true);
                return;
            }

            setLoading(true);
            const loadedFiles = [];

            // Known files based on the directory structure
            const knownFiles = ['5.10', '6.12']; // Add more as needed

            for (const fileName of knownFiles) {
                try {
                    const module = await import(`../data/${guildData.folder}/rules/${fileName}.json`);
                    loadedFiles.push({
                        filename: `${fileName}.json`,
                        date: fileName,
                        data: module.default
                    });
                } catch (err) {
                    console.warn(`Could not load rule file ${fileName}:`, err);
                }
            }

            // Sort by date (most recent first)
            loadedFiles.sort((a, b) => parseDate(b.date) - parseDate(a.date));

            setRulesFiles(loadedFiles);
            
            // Set the most recent version as default
            if (loadedFiles.length > 0) {
                setSelectedVersion(loadedFiles[0]);
            }
            
            setLoading(false);
        };

        loadRulesFiles();
    }, [currentGuild, guildData, guildLoading]);

    const handleVersionSelect = (version) => {
        setSelectedVersion(version);
        setSelectedDevSection(null); // Reset dev section when changing version
        setIsVersionSelectorVisible(false); // Hide version selector
        
        // Scroll to intro section after a short delay to ensure content is rendered
        setTimeout(() => {
            const introSection = document.querySelector('.intro-section');
            if (introSection) {
                introSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    };

    const handleDevSectionClick = (sectionKey, sectionData) => {
        setSelectedDevSection({ key: sectionKey, data: sectionData });
    };

    const closeDevSection = () => {
        setSelectedDevSection(null);
    };

    const toggleVersionSelector = () => {
        setIsVersionSelectorVisible(!isVersionSelectorVisible);
    };

    if (loading || guildLoading) {
        return (
            <div className={styles.rulesContainer}>
                <div className={styles.rulesHeader}>
                    <h2 className={styles.allianceName}>正在加载盟规...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.rulesContainer}>
            <div className={styles.rulesHeader}>
                <h2 className={styles.allianceName}>
                    {guildData?.guild || "BadBoyZ"}
                </h2>
                <p className={styles.subtitle}>盟规管理</p>
            </div>

            {/* Version Selector Toggle Button */}
            <button 
                className={styles.versionToggleButton}
                onClick={toggleVersionSelector}
                title="选择版本"
            >
                <span className={`${styles.toggleArrow} ${isVersionSelectorVisible ? styles.arrowExpanded : ''}`}>
                    &lt;
                </span>
            </button>

            {/* Version Selector */}
            <div className={`${styles.versionSelector} ${isVersionSelectorVisible ? styles.visible : ''}`}>
                <h3 className={styles.versionTitle}>选择版本：</h3>
                <div className={styles.versionButtons}>
                    {rulesFiles.map((ruleFile, index) => (
                        <button
                            key={ruleFile.filename}
                            className={`${styles.versionButton} ${
                                selectedVersion?.filename === ruleFile.filename ? styles.activeVersion : ''
                            } ${index === 0 ? styles.latestVersion : styles.oldVersion}`}
                            onClick={() => handleVersionSelect(ruleFile)}
                        >
                            {ruleFile.date}
                            {index === 0 && <span className={styles.latestBadge}>最新</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            {selectedVersion && (
                <div className={styles.contentContainer}>
                    {/* Intro Section */}
                    <div className={`${styles.section} intro-section`}>
                        <h3 className={styles.sectionTitle}>
                            介绍
                            {rulesFiles.length > 0 && selectedVersion?.filename === rulesFiles[0].filename && (
                                <span className={styles.latestIntroLabel}>最新</span>
                            )}
                        </h3>
                        <div className={styles.introContent}>
                            {selectedVersion.data.intro?.message?.greeting && (
                                <p className={styles.greeting}>{selectedVersion.data.intro.message.greeting}</p>
                            )}
                            {selectedVersion.data.intro?.message?.introduction && (
                                <p className={styles.introText}>{selectedVersion.data.intro.message.introduction.content}</p>
                            )}
                            {selectedVersion.data.intro?.message?.vision && (
                                <p className={styles.introText}>{selectedVersion.data.intro.message.vision.content}</p>
                            )}
                            {selectedVersion.data.intro?.message?.participation && (
                                <p className={styles.introText}>{selectedVersion.data.intro.message.participation.content}</p>
                            )}
                        </div>
                    </div>

                    {/* Dev Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            开发规则
                            {rulesFiles.length > 0 && selectedVersion?.filename === rulesFiles[0].filename && (
                                <span className={styles.latestIntroLabel}>最新</span>
                            )}
                        </h3>
                        <div className={styles.devButtons}>
                            {selectedVersion.data.dev && Object.entries(selectedVersion.data.dev).map(([key, value]) => (
                                <button
                                    key={key}
                                    className={styles.devButton}
                                    onClick={() => handleDevSectionClick(key, value)}
                                >
                                    {key === 'rules' ? '盟规' : 
                                     key === 'notes' ? '须知' :
                                     key === 'resources' ? '资源' :
                                     key === 'competition' ? '争霸' : key}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conclusion Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            总结
                            {rulesFiles.length > 0 && selectedVersion?.filename === rulesFiles[0].filename && (
                                <span className={styles.latestIntroLabel}>最新</span>
                            )}
                        </h3>
                        <div className={styles.conclusionContent}>
                            {selectedVersion.data.conclusion?.future && (
                                <div className={styles.conclusionSubsection}>
                                    <h4>{selectedVersion.data.conclusion.future.title}</h4>
                                    <ul>
                                        {selectedVersion.data.conclusion.future.plans.map((plan, index) => (
                                            <li key={index}>{plan}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedVersion.data.conclusion?.newbieTips && (
                                <div className={styles.conclusionSubsection}>
                                    <h4>{selectedVersion.data.conclusion.newbieTips.title}</h4>
                                    <ul>
                                        {selectedVersion.data.conclusion.newbieTips.tips.map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedVersion.data.conclusion?.closing && (
                                <p className={styles.closingText}>{selectedVersion.data.conclusion.closing.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Dev Section Modal */}
            {selectedDevSection && (
                <div className={styles.modalOverlay} onClick={closeDevSection}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {selectedDevSection.key === 'rules' ? '盟规详情' : 
                                 selectedDevSection.key === 'notes' ? '须知详情' :
                                 selectedDevSection.key === 'resources' ? '资源详情' :
                                 selectedDevSection.key === 'competition' ? '争霸详情' : selectedDevSection.key}
                            </h3>
                            <button
                                className={styles.modalCloseButton}
                                onClick={closeDevSection}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {selectedDevSection.data.title && (
                                <h4 className={styles.modalSectionTitle}>{selectedDevSection.data.title}</h4>
                            )}
                            {selectedDevSection.data.content && (
                                <p>{selectedDevSection.data.content}</p>
                            )}
                            {selectedDevSection.data.rules && (
                                <ul className={styles.modalList}>
                                    {selectedDevSection.data.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </ul>
                            )}
                            {selectedDevSection.data.arrangements && (
                                <ul className={styles.modalList}>
                                    {selectedDevSection.data.arrangements.map((arrangement, index) => (
                                        <li key={index}>{arrangement}</li>
                                    ))}
                                </ul>
                            )}
                            {selectedDevSection.data.details && (
                                <ul className={styles.modalList}>
                                    {selectedDevSection.data.details.map((detail, index) => (
                                        <li key={index}>{detail}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
