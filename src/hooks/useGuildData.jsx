
import { useState, useEffect } from 'react';

export const useGuildData = (currentGuild) => {
    const [guildData, setGuildData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGuildData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Dynamically import guild data based on currentGuild
                const module = await import(`../data/guilds/${currentGuild}.json`);
                setGuildData(module.default);
            } catch (err) {
                console.error(`Could not load guild data for ${currentGuild}:`, err);
                setError(err);
                setGuildData(null);
            } finally {
                setLoading(false);
            }
        };

        if (currentGuild) {
            loadGuildData();
        }
    }, [currentGuild]);

    return { guildData, loading, error };
};
