import * as express from "express";
import passport from 'passport';
import logger from './logger';

passport.serializeUser((user: any, done) => {
    logger.debug(`[Authntication] [serializeUser] user info: ${JSON.stringify(user)}`)
    done(null, user.email);
});

passport.deserializeUser((id: any, done) => {
    if (id) {
        logger.debug(`[Authntication] [expressAuthentication] user id: ${id}`)
        done(null, id);
    } else {
        logger.error(`[Authntication] [expressAuthentication] not authorized`)
        done(new Error('User not authorized'))
    }
});

export async function expressAuthentication(
        request: express.Request,
        securityName: string,
        scopes?: string[]
    ): Promise<any> {
    logger.info(`[Authntication] [expressAuthentication] Call security option: ${securityName}`)
    logger.debug(`[Authntication] [expressAuthentication] Headers: ${JSON.stringify(request.headers)}`)
    if (securityName === 'passport-cookie') {
        if (request.user) {
            logger.debug(`[Authntication] [expressAuthentication] Session user: ${request.user}`)
            return Promise.resolve(request.user);
        } else {
            logger.error(`[Authntication] [expressAuthentication] Session expired.`)
            return Promise.reject(new Error('Session expired.'))
        }
    } else {
        logger.error(`[Authntication] [expressAuthentication] Undefined authentication detected.`)
        return Promise.reject(new Error('Undefined authentication detected.'))
    }
}