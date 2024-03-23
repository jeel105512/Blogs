import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/PostsController.js";
import {
  isAuthenticated,
  isRole,
} from "../controllers/AuthenticationController.js";
import { upload } from "../routes/UserRoutes.js";

const router = Router();

router.get("/", isRole("ADMIN"), index);
router.get("/new", add);
router.get("/:id", isAuthenticated, show);
router.get("/:id/edit", isAuthenticated, edit);
router.post("/", upload.single("image"), create);
router.post("/:id", (req, _, next) => {
  req.method = "put";
  next();
});
router.put("/:id", isAuthenticated, upload.single("image"), update);
router.delete("/:id", isAuthenticated, isRole("ADMIN"), remove);

export default router;