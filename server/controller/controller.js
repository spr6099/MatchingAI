import Startup from "../models/startup.models.js";
import Investor from "../models/invester.models.js";
import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ store in .env
});

// const startups = [
//   {
//     name: "Finly",
//     description:
//       "AI-driven personal finance app helping users save and invest smarter.",
//     industry: "Fintech",
//     stage: "Seed",
//     fundingSought: "$300k",
//     location: "India",
//   },
//   {
//     name: "NeuroVision",
//     description: "Computer vision AI for medical diagnostics in hospitals.",
//     industry: "Artificial Intelligence",
//     stage: "Series A",
//     fundingSought: "$2M",
//     location: "USA",
//   },
//   {
//     name: "EcoCharge",
//     description: "Sustainable EV charging stations powered by solar energy.",
//     industry: "CleanTech",
//     stage: "Series B",
//     fundingSought: "$5M",
//     location: "Germany",
//   },
//   {
//     name: "MediAI",
//     description:
//       "AI-powered platform for early cancer detection using blood samples.",
//     industry: "Healthcare",
//     stage: "Series A",
//     fundingSought: "$3M",
//     location: "UK",
//   },
//   {
//     name: "ShopEase",
//     description: "Social commerce app integrating influencers with e-commerce.",
//     industry: "E-commerce",
//     stage: "Seed",
//     fundingSought: "$500k",
//     location: "Singapore",
//   },
// ];

// const investors = [
//   {
//     name: "Alpha Ventures",
//     focusIndustry: "Fintech",
//     stage: "Seed",
//     geography: "India",
//     pastInvestments: ["PayMate", "QuickPay", "LoanBuddy"],
//     checkSize: "$100k - $500k",
//   },
//   {
//     name: "Tech Angels",
//     focusIndustry: "Artificial Intelligence",
//     stage: "Series A",
//     geography: "USA",
//     pastInvestments: ["VisionX", "DataCore", "ChatBot Inc."],
//     checkSize: "$1M - $5M",
//   },
//   {
//     name: "Global Impact Fund",
//     focusIndustry: "CleanTech",
//     stage: "Seed to Series B",
//     geography: "Global",
//     pastInvestments: ["GreenPower", "EcoDrive", "SolarNow"],
//     checkSize: "$500k - $10M",
//   },
//   {
//     name: "MedCapital Partners",
//     focusIndustry: "Healthcare & Biotech",
//     stage: "Series A - Series C",
//     geography: "Europe",
//     pastInvestments: ["MediScan", "BioNext", "CurePath"],
//     checkSize: "$2M - $20M",
//   },
//   {
//     name: "NextGen Ventures",
//     focusIndustry: "E-commerce & Consumer Tech",
//     stage: "Seed - Series A",
//     geography: "Southeast Asia",
//     pastInvestments: ["ShopSmart", "DealHub", "Cartly"],
//     checkSize: "$250k - $2M",
//   },
// ];

// export const seedData = async (req, res) => {
//   try {
//     // Drop collections if they exist
//     if (await Startup.collection.drop().catch(() => {})) {
//       console.log("Dropped Startup collection");
//     }
//     if (await Investor.collection.drop().catch(() => {})) {
//       console.log("Dropped Investor collection");
//     }

//     const insertedStartup = await Startup.insertMany(startups);
//     const insertedInvestor = await Investor.insertMany(investors);

//     res.status(201).json({
//       message: "🌱 Database seeded successfully",
//       startups: insertedStartup,
//       investors: insertedInvestor,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "❌ Error seeding data", error: error.message });
//   }
// };

// ✅ CLI / script version
// export const runSeed = async () => {
//   try {
//     await Startup.collection.drop().catch(() => {});
//     await Investor.collection.drop().catch(() => {});

//     await Startup.insertMany(startups);
//     await Investor.insertMany(investors);

//     console.log("🌱 Database seeded successfully");
//   } catch (error) {
//     console.error("❌ Error seeding data:", error.message);
//   }
// };

export const getStartups = async (req, res) => {
  try {
    const data = await Startup.find();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Error fetching startups", error: error.message });
  }
};

export const getInvestors = async (req, res) => {
  try {
    const data = await Investor.find();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Error fetching investors", error: error.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const { type, id } = req.body;
    let profile, candidates;

    if (type === "investor") {
      profile = await Investor.findById(id);
      candidates = await Startup.find();
    } else {
      profile = await Startup.findById(id);
      candidates = await Investor.find();
    }

    const prompt = `
You are an AI matching system. Match the given ${type} with the most suitable profiles.

Profile:
${JSON.stringify(profile)}

Candidates:
${JSON.stringify(candidates)}

Rules:
- Match on industry/focusIndustry
- Match on stage (Seed, Series A, B…)
- Consider geography (location vs geography)
- Funding sought vs check size


Return strictly a JSON array of 3 matches:
[{ "name": "", "industry": "", "stage": "", "reason": "" }]
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let matches = [];
    try {
      // sometimes response is inside `response.choices[0].message.content`
      let raw = response.choices[0]?.message?.content?.trim() || "";
      raw = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      matches = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err.message);
      console.error("Raw AI response:", response.choices[0]?.message?.content);

      // if parse fails, return friendly fallback
      return res.status(429).json({
        message:
          "AI response could not be parsed. Possibly API limit reached or malformed response.",
        matches: [],
      });
    }

    res.json({ profile, matches });
    console.log({ matches });
  } catch (error) {
    console.error(" OpenAI API error:", error);

    // Special handling for API limit
    if (error.error?.type === "insufficient_quota") {
      return res.status(429).json({
        message:
          "Your OpenAI API quota/limit has been exceeded. Please check your plan or try later.",
        matches: [],
      });
    }

    res.status(500).json({
      message: "Error generating matches",
      error: error.message,
      matches: [],
    });
  }
};
