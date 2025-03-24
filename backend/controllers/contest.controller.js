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


export const toggleBookmarkContest = async (req, res) => {
    try {
        const { contestId } = req.body;
        const user = req.user;
        // const user = await User.findById(userId);
        // if (!user) return res.status(404).json({ error: 'User not found' });
    
        const index = user.bookmarks.indexOf(contestId);
        if (index === -1) {
          user.bookmarks.push(contestId);
        } else {
          user.bookmarks.splice(index, 1);
        }
        await user.save();
        const bookmark = await User.findById(req.user._id).populate("bookmarks");
        res.json({ success: true, bookmarks: bookmark.bookmarks });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("bookmarks");
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({bookmarks : user.bookmarks});
    } catch (err) {
        res.status(500).json({ message: err.message });
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