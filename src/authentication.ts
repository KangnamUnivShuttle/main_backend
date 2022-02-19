import * as express from "express";
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(
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

passport.serializeUser((user, done) => {
    console.log('[Authntication] [serializeUser]', 'user', user)
    done(null, user);
  });

export async function expressAuthentication(
        request: express.Request,
        securityName: string,
        scopes?: string[]
    ): Promise<any> {
    if (securityName === 'passport-cookie') {
        passport.deserializeUser((id: any, done) => {
            console.log('[Authntication] [expressAuthentication] id', id)
            if (id) {
                done(null, id);
                return Promise.resolve({
                    id: 1,
                    name: "Ironman",
                });
            } else {
                return Promise.reject({});
            }
        });
    } else {
        return Promise.reject({});
    }
}