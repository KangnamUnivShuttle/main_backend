import * as express from "express";
import passport from 'passport';

passport.serializeUser((user: any, done) => {
    console.log('[Authntication] [serializeUser]', 'user', user)
    done(null, user.email);
});

passport.deserializeUser((id: any, done) => {
    if (id) {
        console.log('[Authntication] [expressAuthentication] id', id)
        done(null, id);
    } else {
        console.log('[Authntication] [expressAuthentication] not authorized')
        done(new Error('User not authorized'))
    }
});

export async function expressAuthentication(
        request: express.Request,
        securityName: string,
        scopes?: string[]
    ): Promise<any> {
    console.log('[Authntication] [expressAuthentication]', 'securityName', securityName, 'req head', request.headers)
    if (securityName === 'passport-cookie') {
        if (request.user) {
            console.log('[Authntication] [expressAuthentication]', request.user)
            return Promise.resolve(request.user);
        } else {
            return Promise.reject(new Error('Session expired.'))
        }
    } else {
        return Promise.reject(new Error('Undefined authentication detected.'))
    }
}