import express from "express";
const router = express.Router();
import * as userController from "../controllers/user.controller.js";

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userController.getUser(req, res);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
