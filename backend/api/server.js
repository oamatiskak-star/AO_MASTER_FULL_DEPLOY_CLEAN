import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import projectsRouter from "./routes/projects.js";
import pingRouter from "./routes/ping.js";

const app = express();
app.use(express.json());

// ROUTES
app.use("/api/projects", projectsRouter);
app.use("/api/ping", pingRouter);

// START SERVER (Render FIX)
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend draait op poort: " + PORT);
});
