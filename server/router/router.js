import express from "express";
import {
  getInvestors,
  getMatches,
  getStartups,
  // seedData,
} from "../controller/controller.js";

const router = express.Router();

// router.post("/seedStartup", seedData);
router.get("/getStartups", getStartups);
router.get("/getInvestors", getInvestors);
router.post("/match", getMatches);

export default router;
