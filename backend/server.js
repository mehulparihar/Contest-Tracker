import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import contestRoutes from "./routes/contest.route.js"
import cron from "./utils/cron.utils.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contest", contestRoutes);

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT); 
    connectDB();
})

