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

describe("Run chatbot runtime", () => {
    it('Request wrong req type', done => {
        agent.post('/runtime/kakaochat')
        .type('application/json')
        .send({ name: 'modolee' })
        .then(result => {
            expect(result.status).toBe(400);
            done();
        })
    });
    // it('Get current weather', done => {
    //     request(app).post('/runtime/kakaochat')
    //     .type('application/json')
    //     .send({ name: 'modolee' })
    //     .then(result => {
    //         expect(result.status).toBe(400);
    //         done();
    //     })
    // });
});