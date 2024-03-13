import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default () => {
  // connect to mongodb using mongoose
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_TOKEN}.mongodb.net/blogs?retryWrites=true&w=majority`
    )
    .then(() => {
      console.info("MongoDb Connected");
    })
    .catch((error) => {
      console.error(error);
    });
};
