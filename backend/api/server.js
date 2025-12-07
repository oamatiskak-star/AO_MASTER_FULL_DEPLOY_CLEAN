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

// START SERVER
const PORT = 4000;
app.listen(PORT, () => {
  console.log("Backend draait op http://localhost:" + PORT);
});
