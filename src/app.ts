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
import redis from 'redis';
import connectRedis from 'connect-redis';
import cors, { CorsOptions } from 'cors'

const LocalStrategy = passportLocal.Strategy;

export const app = express();

const corsOptions = {
  origin : "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
} as CorsOptions
app.use(cors(corsOptions))

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const RedisStore = connectRedis(session);
const redisUrl = `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || '6379'}`
logger.debug(`[App] [Redis-Init] redis url ${redisUrl}`)
const redisClient = redis.createClient(Number(process.env.REDIS_PORT || '6379'), process.env.REDIS_HOST || '127.0.0.1')
// redisClient.connect()

redisClient.on('error', (err) => {
  logger.error(`[App] [RedisClient-error] err: ${err.message}`)
})

redisClient.on('connect', () => {
  logger.info(`[App] [RedisClient-connect] redis connected.`)
})

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
app.use(session({ 
  secret: process.env.SESSION_KEY || 'testSecret', 
  resave: false, 
  saveUninitialized: false, 
  cookie: {
    maxAge: Number(process.env.SESSION_TIME) || 1800000 ,
    httpOnly: true,
    secure: false,

  },
  store: new RedisStore({ 
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || '6379'),
    client: redisClient,
    disableTouch: true
   }) 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("./swagger.json"))
  );
});

RegisterRoutes(app);