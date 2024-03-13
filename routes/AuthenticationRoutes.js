import {
  login,
  authenticate,
  logout,
  isAuthenticated,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword
} from "../controllers/AuthenticationController.js";
import { add } from "../controllers/UsersController.js";
import { Router } from "express";

const router = Router();

router.get("/login", login);
router.post("/authenticate", authenticate);
router.get("/logout", isAuthenticated, logout);
router.get("/register", add);
router.get("/forgot-password", getForgotPassword); // Lab-03
router.post("/forgot-password", postForgotPassword); // Lab-03
router.get("/reset-password/:token", getResetPassword); // Lab-03
router.post("/reset-password", postResetPassword); // Lab-03

export default router;
