import request from 'supertest';
import { SAMPLE_KAKAO_REQ_OBJ } from '../global';

let server: any;
let agent: request.SuperAgentTest;

beforeAll((done) => {
    const {app, httpServer} = require('../../src/server');
    server = httpServer
    agent = request.agent(server);
    done();
});

afterAll((done) => {
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
    it('Get current weather', done => {
        agent.post('/runtime/kakaochat')
        .type('application/json')
        .send(SAMPLE_KAKAO_REQ_OBJ)
        .then(result => {
            expect(result.status).toBe(200);
            done();
        })
    });
});