import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import MongooseSetup from "./lib/MongooseSetup.js";
import RoutesSetup from "./lib/RoutesSetup.js";
import PassportSetup from "./lib/PassportSetup.js";

// congifuring the environment variable using dotenv (.env)
dotenv.config();

// connect to mongodb using mongoose
MongooseSetup();

const app = express();

// session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, // if I dont have a session established because I am not logged-in do I want you to save the session anyways
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  })
);

// passport
PassportSetup(app);

// setting up the ejs for views
app.set("view engine", "ejs");
// for static files like css or js
app.use(express.static("public"));
app.use(express.static("avatars"));
app.use(express.static("posts"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// making it so that we can use all the http verbs
app.use((req, _, next) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;
    delete req.body._method;
    req.method = method;
  }
  next();
});

// routes
RoutesSetup(app);

// error handler
app.use((error, req, res, __) => {
  if (typeof error === "string") {
    error = new Error(error);
  }

  if (!error.status) {
    error.status = 404;
  }

  console.error(error);

  res.format({
    "text/html": () => {
      if (req.session)
        req.session.notifications = [
          {
            alertType: "alert-danger",
            message: error.message,
          },
        ];

        res.status(error.status).redirect("/");
    },
    "application/json": () => {
      res
        .status(error.status)
        .json({ status: error.status, message: error.message });
    },
    default: () => {
      res.status(406).send("NOT ACCEPTABLE");
    },
  });

  res.status(error.status).send(error.message);
});

export default app;
