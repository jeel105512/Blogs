import multer from "multer";
import crypto from "crypto";
import { Router } from "express";
import {
  index,
  show,
  add,
  edit,
  create,
  update,
  remove,
} from "../controllers/UsersController.js";
import {
  isAuthenticated,
  isRole,
} from "../controllers/AuthenticationController.js";

const router = Router();

// temp storage location
const tempStorageLocation = process.env.TEMP_FILE_DIR || "temp";

// storage solution
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, tempStorageLocation); // responsible for actually putting the file in the temp storage location
  },
  filename: (_, file, callback) => {
    const filename = `${generateRandomHexKey()}-${file.originalname}`;
    callback(null, filename); // this will create the file name
  },
});

export const upload = multer({ storage });

router.get("/", isRole("ADMIN"), index);
router.get("/new", add);
router.get("/:id", isAuthenticated, show);
router.get("/:id/edit", isAuthenticated, edit);
router.post("/", upload.single("avatar"), create);
router.post("/:id", (req, _, next) => {
  req.method = "put";
  next();
});
router.put("/:id", isAuthenticated, upload.single("avatar"), update);
router.delete("/:id", isAuthenticated, isRole("ADMIN"), remove);

export function generateRandomHexKey(length) {
  return crypto.randomBytes((length || 8) / 2).toString("hex");
}

export default router;
