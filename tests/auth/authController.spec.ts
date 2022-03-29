
import request from 'supertest';
import { logIn } from '../auth';

let server: any;
let agent: request.SuperAgentTest;
let _shutdownManager: any;

beforeAll(async (done) => {
    const {app, httpServer, shutdownManager} = await require('../../src/server');
    server = httpServer
    agent = request.agent(server);
    _shutdownManager = shutdownManager
    done();
});

afterAll((done) => {
    return  server && server.close(done);
    // _shutdownManager.terminate()
    done()
});

describe("Auth test", () => {
    it('Login in', async (done) => {
        const result = await logIn(server)
        expect(result).toBe(true)
        done()
    });
});