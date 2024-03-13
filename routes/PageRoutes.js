import { Router } from "express";
import { home } from "../controllers/PagesController.js";
import { isAuthenticated } from "../controllers/AuthenticationController.js";

const router = Router();

// router.get("/:id", id);
// router.get("/insult", insult);
router.get("/", isAuthenticated, home);

export default router;