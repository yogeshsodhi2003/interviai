import User from "../models/user.js";

export const updateResume = async (userId, resumeSummary) => {
  console.log("Updating resume summary for user in database:", userId);
  try {
    const user = await User.findByIdAndUpdate(userId, { resumeSummary });
    return user.resumeSummary;
  } catch (err) {
    console.error("Error updating resume summary:", err);
    throw err;
  }
};