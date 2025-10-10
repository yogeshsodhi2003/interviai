import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: "Unique Firebase UID for authentication",
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    description: "User email from Firebase",
  },
  name: {
    type: String,
    required: false,
    description: "User display name from Firebase",
  },
  resumeSummary: {
    type: String,
    required: false,
    description: "AI-generated or user-provided resume summary",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
