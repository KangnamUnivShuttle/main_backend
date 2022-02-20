import express, { Response as ExResponse, Request as ExRequest } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";
import swaggerUi from "swagger-ui-express";
import passport from 'passport';
import session from 'express-session';
import passportLocal from 'passport-local';
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
        console.log('[Authntication] [LocalStrategy]', 'username', username, 'password', password)
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
app.use(session({ secret: 'testSecret', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("./swagger.json"))
  );
});

RegisterRoutes(app);