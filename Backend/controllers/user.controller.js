import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword, // Changed from hashedPw to password
      name,
      resumeSummary: null,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(201)
      .json({ message: "User created", user: newUser, token });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }


    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "Login successful", user: user, token });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      email: user.email,
      name: user.name,
      resumeSummary: user.resumeSummary,
    });
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, resumeSummary } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name !== undefined) user.name = name;
    if (resumeSummary !== undefined) user.resumeSummary = resumeSummary;

    await user.save();
    return res.json({ message: "User updated" });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
