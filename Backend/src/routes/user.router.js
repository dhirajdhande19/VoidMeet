import { Router } from "express";
import {
  register,
  login,
  addToHistory,
  getUserHistory,
  getDashboard,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../Middlewares.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/dashboard", authMiddleware, getDashboard);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);

export default router;
