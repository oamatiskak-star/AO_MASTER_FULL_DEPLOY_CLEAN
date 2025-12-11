import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------
// AUTOLOAD ALL ROUTES
// ---------------------------
const routesPath = path.resolve("backend/api/routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const name = file.replace(".js", "");
    import(`./routes/${file}`).then((mod) => {
      app.use(`/api/${name}`, mod.default);
    });
  }
});

// ---------------------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("AO Backend draait op poort: " + PORT);
});
