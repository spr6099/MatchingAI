import mongoose from "mongoose";

const db = async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/investorStartupDB", {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
  }
};

export default db;
