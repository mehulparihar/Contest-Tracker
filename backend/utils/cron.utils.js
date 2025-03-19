import { fetchAndSaveContests } from "./fetchContest.utils.js";
import cron from "node-cron";

cron.schedule('0 * * * *', () => {
    console.log('Running cron job to fetch contests...');
    fetchAndSaveContests();
});

export default cron;