import axios from "axios";


export const fetchCodeforcesContests = async () => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        return response.data.result
            .filter(contest => contest.phase === 'BEFORE')
            .map(contest => ({
                platform: 'Codeforces',
                name: contest.name,
                startTime: new Date(contest.startTimeSeconds * 1000),
                endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
                link: `https://codeforces.com/contest/${contest.id}`,
            }));
    } catch (err) {
        console.error('Error fetching Codeforces contests:', err);
        return [];
    }
};

export const fetchCodeChefContests = async () => {
    
    return [];
};

export const fetchLeetCodeContests = async () => {

    return [];
};