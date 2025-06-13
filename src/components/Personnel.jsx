import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Personnel.module.css";
import { useGuildData } from "../hooks/useGuildData";

export default function Personnel() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentGuild = location.state?.currentGuild || "badBoyz";
    const [personnelData, setPersonnelData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Table functionality states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Help modal state
    const [showHelpModal, setShowHelpModal] = useState(false);

    // Use dynamic guild data hook
    const {
        guildData,
        loading: guildLoading,
        error,
    } = useGuildData(currentGuild);

    // Function to dynamically import member files
    const loadMemberData = async (guildFolder, role, memberName) => {
        try {
            const module = await import(
                `../data/${guildFolder}/${role}/${memberName}.json`
            );
            return module.default;
        } catch (error) {
            console.warn(
                `Could not load data for ${memberName} in ${role}:`,
                error,
            );
            return {
                选手: memberName,
                职位: role,
                入盟时间: "未知",
                荣耀: [],
            };
        }
    };

    // Utility functions (moved to top to avoid hoisting issues)
    const getPositionClass = (position) => {
        const positionMap = {
            盟主: "Leader",
            代理盟主: "ActingLeader",
            副盟主: "ViceLeader",
            管理: "Manager",
            manager: "Manager",
            资深: "Senior",
            elite: "Senior",
            成员: "Member",
            member: "Member",
            temp: "Temp",
        };
        return positionMap[position] || "Member";
    };

    const getRoleDisplayName = (role) => {
        const roleMap = {
            manager: "管理",
            elite: "资深",
            member: "成员",
            temp: "临时",
        };
        return roleMap[role] || role;
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return "↕️";
        }
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    // Get color intensity based on honor count
    const getHonorColorStyle = (honorCount) => {
        const maxHonors = Math.max(
            ...personnelData.map((p) => (p.荣耀 ? p.荣耀.length : 0)),
            1,
        );
        const intensity = honorCount / maxHonors;

        // Generate colors from light red to dark red based on intensity
        const lightColor = { r: 255, g: 182, b: 193 }; // Light pink/red #ffb6c1
        const darkColor = { r: 139, g: 0, b: 0 }; // Dark red #8b0000

        const r = Math.round(
            lightColor.r + (darkColor.r - lightColor.r) * intensity,
        );
        const g = Math.round(
            lightColor.g + (darkColor.g - lightColor.g) * intensity,
        );
        const b = Math.round(
            lightColor.b + (darkColor.b - lightColor.b) * intensity,
        );

        const backgroundColor = `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.2})`;
        const borderColor = `rgb(${r}, ${g}, ${b})`;
        const textColor = `rgb(${r}, ${g}, ${b})`;
        const boxShadow = `0 0 ${4 + intensity * 6}px rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.2})`;

        return {
            backgroundColor,
            borderColor,
            color: textColor,
            boxShadow,
        };
    };

    // Sorting function
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filteredData = personnelData.filter((player) => {
            const searchLower = searchTerm.toLowerCase();

            // Check if search term is a number for honor count search
            const searchNumber = parseInt(searchTerm);
            const honorCount = player.荣耀 ? player.荣耀.length : 0;

            // If search term is a valid number, check honor count
            if (!isNaN(searchNumber) && searchTerm.trim() !== "") {
                return honorCount === searchNumber;
            }

            // Otherwise, search in basic player info
            return (
                player.选手.toLowerCase().includes(searchLower) ||
                getRoleDisplayName(player.职位)
                    .toLowerCase()
                    .includes(searchLower) ||
                player.入盟时间.toLowerCase().includes(searchLower)
            );
        });

        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Special handling for role sorting
                if (sortConfig.key === "职位") {
                    const roleOrder = {
                        盟主: 1,
                        代理盟主: 2,
                        副盟主: 3,
                        manager: 4,
                        elite: 5,
                        member: 6,
                        temp: 7,
                    };
                    aValue = roleOrder[aValue] || 999;
                    bValue = roleOrder[bValue] || 999;
                }

                // Special handling for 荣耀 sorting (by count)
                if (sortConfig.key === "荣耀") {
                    aValue = a.荣耀 ? a.荣耀.length : 0;
                    bValue = b.荣耀 ? b.荣耀.length : 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [personnelData, searchTerm, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredAndSortedData.slice(startIndex, endIndex);

    // Reset to first page when search or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    // Handle player row click
    const handlePlayerClick = (player) => {
        navigate("/player", {
            state: {
                playerData: player,
            },
        });
    };

    // Handle help modal
    const toggleHelpModal = () => {
        setShowHelpModal(!showHelpModal);
    };

    // Load all personnel data dynamically
    useEffect(() => {
        const loadAllPersonnelData = async () => {
            if (guildLoading || !guildData) {
                setLoading(true);
                return;
            }

            if (!guildData.members) {
                setPersonnelData([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const loadedData = [];

            // Load data for each member
            for (const member of guildData.members) {
                const memberData = await loadMemberData(
                    guildData.folder,
                    member.role,
                    member.name,
                );
                loadedData.push(memberData);
            }

            setPersonnelData(loadedData);
            setLoading(false);
        };

        loadAllPersonnelData();
    }, [guildData, guildLoading]);

    if (loading || guildLoading) {
        return (
            <div className={styles.personnelContainer}>
                <div className={styles.personnelHeader}>
                    <h2 className={styles.title}>人员变动</h2>
                    <p className={styles.subtitle}>正在加载联盟成员信息...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.personnelContainer}>
            <div className={styles.personnelHeader}>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>人员变动</h2>
                    <div className={styles.subtitleRow}>
                        <p className={styles.subtitle}>联盟成员管理信息</p>
                        <button
                            className={styles.helpButton}
                            onClick={toggleHelpModal}
                            title="帮助信息"
                        >
                            ?
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Controls */}
            <div className={styles.tableControls}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="搜索选手、职位、入盟时间或荣耀数量(如：3)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.controlsRight}>
                    <select
                        value={itemsPerPage}
                        onChange={(e) =>
                            setItemsPerPage(Number(e.target.value))
                        }
                        className={styles.itemsPerPageSelect}
                    >
                        <option value={5}>5 条/页</option>
                        <option value={10}>10 条/页</option>
                        <option value={20}>20 条/页</option>
                        <option value={50}>50 条/页</option>
                    </select>
                </div>
            </div>

            {/* Results Info */}
            <div className={styles.resultsInfo}>
                显示 {startIndex + 1}-
                {Math.min(endIndex, filteredAndSortedData.length)} 条， 共{" "}
                {filteredAndSortedData.length} 条记录
            </div>

            <div className={styles.personnelTable}>
                <div className={styles.tableHeader}>
                    <div
                        className={`${styles.headerCell} ${styles.sortableHeader}`}
                        onClick={() => handleSort("选手")}
                    >
                        选手 {getSortIcon("选手")}
                    </div>
                    <div
                        className={`${styles.headerCell} ${styles.sortableHeader}`}
                        onClick={() => handleSort("职位")}
                    >
                        职位 {getSortIcon("职位")}
                    </div>
                    <div
                        className={`${styles.headerCell} ${styles.sortableHeader}`}
                        onClick={() => handleSort("入盟时间")}
                    >
                        入盟时间 {getSortIcon("入盟时间")}
                    </div>
                    <div
                        className={`${styles.headerCell} ${styles.sortableHeader}`}
                        onClick={() => handleSort("荣耀")}
                    >
                        荣耀 {getSortIcon("荣耀")}
                    </div>
                </div>

                <div className={styles.tableBody}>
                    {currentData.length > 0 ? (
                        currentData.map((player, index) => (
                            <div
                                key={index}
                                className={styles.tableRow}
                                onClick={() => handlePlayerClick(player)}
                            >
                                <div className={styles.playerCell}>
                                    <div className={styles.playerName}>
                                        {player.选手}
                                    </div>
                                </div>
                                <div className={styles.positionCell}>
                                    <span
                                        className={`${styles.positionBadge} ${styles[`position${getPositionClass(player.职位)}`]}`}
                                    >
                                        {getRoleDisplayName(player.职位)}
                                    </span>
                                </div>
                                <div className={styles.dateCell}>
                                    {player.入盟时间}
                                </div>
                                <div className={styles.honorCell}>
                                    <span
                                        className={styles.honorCount}
                                        style={getHonorColorStyle(
                                            player.荣耀
                                                ? player.荣耀.length
                                                : 0,
                                        )}
                                    >
                                        {player.荣耀 ? player.荣耀.length : 0}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>没有找到匹配的记录</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        上一页
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ""}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                            )
                        }
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        下一页
                    </button>
                </div>
            )}

            {/* Help Modal */}
            {showHelpModal && (
                <div className={styles.modalOverlay} onClick={toggleHelpModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>使用说明</h3>
                            <button
                                className={styles.modalCloseButton}
                                onClick={toggleHelpModal}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalSections}>
                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>
                                        说明书
                                    </h3>

                                    <h4>🔍 搜索功能：</h4>
                                    <ul>
                                        <li>搜索选手姓名、职位或入盟时间</li>
                                        <li>
                                            输入数字可搜索特定荣耀数量（如：输入"3"查找有3个荣耀的选手）
                                        </li>
                                    </ul>

                                    <h4>📊 排序功能：</h4>
                                    <ul>
                                        <li>点击表头可对该列进行排序</li>
                                        <li>再次点击可切换升序/降序</li>
                                    </ul>

                                    <h4>👤 查看详情：</h4>
                                    <ul>
                                        <li>点击任意选手行可查看详细信息</li>
                                        <li>荣耀数量用颜色深浅表示多少</li>
                                    </ul>

                                    <h4>📄 分页功能：</h4>
                                    <ul>
                                        <li>
                                            可调整每页显示条数（5/10/20/50）
                                        </li>
                                        <li>使用分页按钮浏览所有记录</li>
                                    </ul>
                                </div>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>
                                        解释
                                    </h3>

                                    <h4>🏅 职位说明：</h4>
                                    <ul>
                                        <li>
                                            <strong>盟主：</strong>{" "}
                                            联盟最高领导者
                                        </li>
                                        <li>
                                            <strong>副盟主：</strong>{" "}
                                            协助盟主管理联盟
                                        </li>
                                        <li>
                                            <strong>管理：</strong>{" "}
                                            负责日常管理工作
                                        </li>
                                        <li>
                                            <strong>资深：</strong>{" "}
                                            经验丰富的核心成员
                                        </li>
                                        <li>
                                            <strong>成员：</strong> 正式联盟成员
                                        </li>
                                        <li>
                                            <strong>临时：</strong> 试用期成员
                                        </li>
                                    </ul>

                                    <h4>🎖️ 荣耀系统：</h4>
                                    <ul>
                                        <li>
                                            <strong>颜色深浅：</strong>{" "}
                                            表示荣耀数量多少
                                        </li>
                                    </ul>

                                    <h4>📅 入盟时间：</h4>
                                    <ul>
                                        <li>
                                            <strong>第一期：</strong>{" "}
                                            联盟创立初期成员
                                        </li>
                                        <li>
                                            <strong>第二期：</strong>{" "}
                                            联盟中期成员
                                        </li>
                                        <li>
                                            <strong>第三期：</strong>{" "}
                                            一二盟合并时期
                                        </li>
                                        <li>
                                            <strong>第四期：</strong> 网站发布前
                                        </li>
                                        <li>
                                            <strong>第五期：</strong> 网站发布后
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
