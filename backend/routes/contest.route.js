import express from "express";
import { getContests, getPastContests,  getSolution, getBookmarks, toggleBookmarkContest } from "../controllers/contest.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getContests);

router.get("/past", getPastContests);

router.post("/:id/solution", getSolution);

router.get("/bookmark", protectRoute, getBookmarks);

router.post("/toogleBookmark",protectRoute, toggleBookmarkContest);

export default router;