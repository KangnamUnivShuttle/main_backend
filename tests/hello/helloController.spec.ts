
import request from 'supertest';

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

describe("GET /hello", () => {
    it('Simple hello world controller return hello world msg', done => {
        agent.get('/hello')
        .then(result => {
            expect(result.status).toBe(200);
            expect(result.text).toBe('\"hello world!\"');

            done();
        })
    });
});