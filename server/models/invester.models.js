import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    focusIndustry: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      required: true,
    },
    geography: {
      type: String,
      required: true,
    },
    pastInvestments: [
      {
        type: String,
      },
    ],
    checkSize: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Investor = mongoose.model("Investor", investorSchema);

export default Investor;
