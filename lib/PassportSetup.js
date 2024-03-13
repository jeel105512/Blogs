import passport from "passport";
import JwtStrategy from "passport-jwt/lib/strategy.js";
import ExtractJwt from "passport-jwt/lib/extract_jwt.js";

import User from "../models/User.js";
import Application from "../models/Application.js";
import { application } from "express";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

export default (app) => {
  passport.use(User.createStrategy()); // creating authenication strategy
  passport.serializeUser(User.serializeUser()); // convert it to json string from an object
  passport.deserializeUser(User.deserializeUser()); // de-convert json string (convert it back to object)

  // JWT Strategy
  passport.use(
    new JwtStrategy(options, async (jwtPayLoad, done) => {
      const app = await Application.findById(jwtPayLoad.id);
      if (!app) {
        return done(null, false);
      }

      return done(null, true);
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.isAdmin = req.user?.role === "ADMIN";
    res.locals.isUser = req.user?.role === "USER";
    next();
  });
};
