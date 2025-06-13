
import React from "react";
import styles from "../styles/Player.module.css";

export default function Player({ playerData }) {
    const getRoleDisplayName = (role) => {
        const roleMap = {
            'manager': '管理',
            'elite': '资深',
            'member': '成员',
            'temp': '临时'
        };
        return roleMap[role] || role;
    };

    const getPositionClass = (position) => {
        const positionMap = {
            '盟主': 'Leader',
            '代理盟主': 'ActingLeader', 
            '副盟主': 'ViceLeader',
            '管理': 'Manager',
            'manager': 'Manager',
            '资深': 'Senior',
            'elite': 'Senior',
            '成员': 'Member',
            'member': 'Member',
            'temp': 'Temp'
        };
        return positionMap[position] || 'Member';
    };

    const getHonorTypeColor = (type) => {
        const typeColors = {
            '联盟争霸赛': '#ff6b6b',
            '跨服竞技赛': '#4ecdc4',
            '联盟推演': '#45b7d1',
            '俱乐部排行': '#96ceb4',
            '个人成就': '#ffeaa7'
        };
        return typeColors[type] || '#d4af37';
    };

    return (
        <div className={styles.playerContainer}>
            <div className={styles.playerHeader}>
                <h1 className={styles.playerName}>{playerData.选手}</h1>
                <div className={styles.playerBasicInfo}>
                    <span className={`${styles.positionBadge} ${styles[`position${getPositionClass(playerData.职位)}`]}`}>
                        {getRoleDisplayName(playerData.职位)}
                    </span>
                    <span className={styles.joinDate}>入盟时间: {playerData.入盟时间}</span>
                    <span className={styles.status}>状态: {playerData.状态 || '在职'}</span>
                    <span className={styles.totalHonor}>总荣耀: {playerData.荣耀 ? playerData.荣耀.length : 0}</span>
                </div>
            </div>

            <div className={styles.playerContent}>
                <div className={styles.statsSection}>
                    <h2 className={styles.sectionTitle}>统计信息</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '联盟争霸赛').length : 0}
                            </div>
                            <div className={styles.statLabel}>联盟争霸赛</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '俱乐部排行').length : 0}
                            </div>
                            <div className={styles.statLabel}>俱乐部排行</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '跨服竞技赛').length : 0}
                            </div>
                            <div className={styles.statLabel}>跨服竞技赛</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '联盟推演').length : 0}
                            </div>
                            <div className={styles.statLabel}>联盟推演</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '日常').length : 0}
                            </div>
                            <div className={styles.statLabel}>日常</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {playerData.荣耀 ? 
                                    playerData.荣耀.filter(h => h.type === '竞技都市').length : 0}
                            </div>
                            <div className={styles.statLabel}>竞技都市</div>
                        </div>
                    </div>
                </div>

                <div className={styles.honorsSection}>
                    <h2 className={styles.sectionTitle}>荣耀展示</h2>
                    {playerData.荣耀 && playerData.荣耀.length > 0 ? (
                        <div className={styles.honorsGrid}>
                            {playerData.荣耀.map((honor, index) => (
                                <div key={index} className={styles.honorCard}>
                                    <div 
                                        className={styles.honorType}
                                        style={{ 
                                            backgroundColor: getHonorTypeColor(honor.type),
                                            color: '#ffffff'
                                        }}
                                    >
                                        {honor.type}
                                    </div>
                                    <div className={styles.honorContent}>
                                        {honor.image && (
                                            <div className={styles.honorImageContainer}>
                                                <img 
                                                    src={honor.image} 
                                                    alt={honor.title}
                                                    className={styles.honorImage}
                                                />
                                            </div>
                                        )}
                                        <h3 className={styles.honorTitle}>{honor.title}</h3>
                                        <p className={styles.honorSeason}>赛季: {honor.season}</p>
                                        {honor.description && (
                                            <p className={styles.honorDescription}>{honor.description}</p>
                                        )}
                                        {honor.date && (
                                            <p className={styles.honorDate}>获得时间: {honor.date}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noHonors}>
                            <p>暂无荣耀记录</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
