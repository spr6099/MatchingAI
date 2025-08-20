import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/Db.js";
import router from "./router/router.js";
// import { runSeed } from "./controller/controller.js"; // ✅ import correctly

const app = express();
app.use(bodyParser.json());
app.use(cors());

db();

// (async () => {
//   try {
//     await runSeed();
//   } catch (error) {
//     console.error(" Error in seeding:", error.message);
//   }
// })();

app.use("/api", router);

// app.use("/", (req, res) => {
//   res.send("Welcome");
// });

app.listen(5001, () => {
  console.log("Server running on Port 5001");
});
