
import request from 'supertest';

let server: any;
let agent: request.SuperAgentTest;

beforeEach((done) => {
    const {app, httpServer} = require('../../src/server');
    server = httpServer
    agent = request.agent(server);
    done();
});

afterEach((done) => {
    return  server && server.close(done);
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