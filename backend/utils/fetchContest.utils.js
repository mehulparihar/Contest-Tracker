import Contest from "../models/contest.model.js";
import { fetchCodeChefContests, fetchCodeforcesContests, fetchLeetCodeContests } from "../services/fetchContest.service.js";


const saveContestsToDB = async (contests) => {
    try {
        const bulkOps = contests.map(contest => ({
            updateOne: {
                filter: { name: contest.name }, // assuming 'name' is unique
                update: { $set: contest },
                upsert: true
            }
        }));
        
        const result = await Contest.bulkWrite(bulkOps);
        console.log(`Added ${result.upsertedCount} new contests and updated ${result.modifiedCount} existing ones`);
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