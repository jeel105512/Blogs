import { Router } from "express";
import * as Resource from "./facade/controllers/ResourcesController.js";
import * as User from "./facade/controllers/UsersController.js";
import * as Post from "./facade/controllers/PostsController.js";
import * as Comment from "./facade/controllers/CommentsController.js";

const router = Router();

router.get("/resources", Resource.index);
router.get("/resources/:id", Resource.show);
router.post("/resources", Resource.create);
router.put("/resources/:id", Resource.update);
router.delete("/resources/:id", Resource.destroy);

router.get("/users/:id", User.show);
router.post("/users", User.create);
router.put("/users/:id", User.update);
router.post("/users/authenticate", User.authenticate);
router.post("/users/logout", User.logout);

// Post routes
router.get("/posts/publicPosts", Post.index);
router.get("/posts/:id", Post.show);

// Comment routes
router.get("/comments", Comment.index);
router.post("/comments", Comment.create);
router.post("/comments/:id/likeComment", Comment.like);
router.post("/comments/:id/dislikeComment", Comment.dislike);

export default router;