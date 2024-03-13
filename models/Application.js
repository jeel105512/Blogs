import mongoose from "mongoose";
import { generateRandomHexKey } from "../routes/UserRoutes.js";

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      rquired: [true, "You need a name for your application"],
    },
    key: {
      type: String,
      required: true,
      default: (generateRandomHexKey(16)),
    },
    secret: {
      type: String,
      required: true,
      default: (generateRandomHexKey(16)),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
