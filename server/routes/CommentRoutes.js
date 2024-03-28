import { Router } from "express";
import {
  index,
  show,
  childComments,
  add,
  edit,
  create,
  update,
  remove,
  likeComment,
  dislikeComment,
} from "../controllers/CommentsController.js";
import {
  isAuthenticated,
  isRole,
} from "../controllers/AuthenticationController.js";

const router = Router();

router.get("/", isRole("ADMIN"), index);
router.get("/new", add);
router.get("/:id", isAuthenticated, show);
router.get("/:id/child-comments", isAuthenticated, childComments);
router.get("/:id/edit", isAuthenticated, edit);
router.post("/", create);
router.post("/:id", (req, _, next) => {
  req.method = "put";
  next();
});
router.post("/:id/likeComment", isAuthenticated, likeComment);
router.post("/:id/dislikeComment", isAuthenticated, dislikeComment);
router.put("/:id", isAuthenticated, update);
router.delete("/:id", isAuthenticated, remove);

export default router;
