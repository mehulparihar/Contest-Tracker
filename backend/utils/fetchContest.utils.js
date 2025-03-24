import Contest from "../models/contest.model.js";
import { fetchCodeChefContests, fetchCodeforcesContests, fetchLeetCodeContests } from "../services/fetchContest.service.js";


const saveContestsToDB = async (contests) => {
    try {
        await Contest.deleteMany({});
        for (const contest of contests) {
            await Contest.insertMany(contest);
        }
        console.log('Contests saved to DB');
    } catch (err) {
        console.error('Error saving contests to DB:', err);
    }
};


export const fetchAndSaveContests = async () => {
    const codeforcesContests = await fetchCodeforcesContests();
    const codechefContests = await fetchCodeChefContests();
    const leetcodeContests = await fetchLeetCodeContests();

    const allContests = [...codeforcesContests, ...codechefContests, ...leetcodeContests];
    await saveContestsToDB(allContests);
};