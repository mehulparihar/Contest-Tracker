import Contest from "../models/contest.model.js";
import User from "../models/user.model.js";

export const getContests = async (req, res) => {
    try {
        let filter = { startTime: { $gte: new Date() } };
        const contests = await Contest.find(filter).sort({ startTime: 1 });
        res.json(contests);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

export const getPastContests = async (req, res) => {
    try {
        const contests = await Contest.find({ startTime: { $lt: new Date() } }).sort({ startTime: -1 });
        res.json(contests);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

export const bookmarkContest = async (req, res) => {
    try {
        const user = req.user;
        // if (!user) {
        //     return res.status(404).json({ error: "User not found" });
        // }
        const { id } = req.params;

        user.markedContest.push(id);
        await user.save();
        res.json({ markedContest: user.markedContest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user).populate("bookmarks");
        res.json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

export const getSolution = async (req, res) => {
    try {
        const { id } = req.params;
        const { solutionLink } = req.body;
        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ error: "Contest not found" });
        contest.solutionLink = solutionLink;
        await contest.save();
        res.json(contest);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};