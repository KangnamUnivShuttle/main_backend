import dotenv from "dotenv";

dotenv.config();

import express, { Response as ExResponse, Request as ExRequest } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";
import swaggerUi from "swagger-ui-express";
import passport from 'passport';
import session from 'express-session';
import passportLocal from 'passport-local';
import logger from './logger';
import "reflect-metadata";
const LocalStrategy = passportLocal.Strategy;

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'passwd'
    },
    (username, password, done) => {
        if (username === 'admin' && password === 'password') {
            return done(null, {
                username,
                test: 'data'
            });
        } else if (username === 'admin' && password !== 'password') {
            return done(null, false, { message: 'Incorrect password.' });
        } else {
            return done(null, false, { message: 'Incorrect username.' });
        }
    }
));
app.use(session({ secret: process.env.SESSION_KEY || 'testSecret', resave: true, saveUninitialized: false, cookie: {maxAge: Number(process.env.SESSION_TIME) || 1800000 } }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("./swagger.json"))
  );
});

RegisterRoutes(app);