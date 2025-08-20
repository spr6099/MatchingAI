import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { 
      type: String, 
    //   enum: ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "IPO"], 
      required: true 
    },
    fundingSought: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Startup = mongoose.model("Startup", startupSchema);
export default Startup;
