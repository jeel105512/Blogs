import PageRoutes from "../routes/PageRoutes.js";
import UserRoutes from "../routes/UserRoutes.js";
import AuthenticationRoutes from "../routes/AuthenticationRoutes.js";
import ApplicationRoutes from "../routes/ApplicationRoutes.js";
import APIRoutes from "../routes/APIRoutes.js";

export default (app) => {
  // routes
  app.use("/", PageRoutes);
  app.use("/users/", UserRoutes);
  app.use("/", AuthenticationRoutes);
  app.use("/applications", ApplicationRoutes);
  app.use("/api", APIRoutes);
};
