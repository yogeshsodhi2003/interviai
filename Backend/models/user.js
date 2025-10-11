import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    description: "User email",
  },
  password:{
    type: String,
    required: true,
    description: "User password",
  },
  name: {
    type: String,
    required: false,
    description: "User display name",
  },
  resumeSummary: {
    type: String,
    required: false,
    description: "AI-generated or user-provided resume summary",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
