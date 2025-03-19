import express from "express";
import { getContests, getPastContests, bookmarkContest, getSolution, getBookmarks } from "../controllers/contest.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getContests);

router.get("/past", getPastContests);

router.get("/:id", protectRoute, bookmarkContest);

router.post("/:id/solution", getSolution);

router.get("/bookmark", protectRoute, getBookmarks);

export default router;