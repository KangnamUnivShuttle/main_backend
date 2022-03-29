import request from 'supertest';
import { insertRuntimeTestData, resetRuntimeTestData } from '../db';
import { SAMPLE_KAKAO_REQ_OBJ } from '../global';

let server: any;
let agent: request.SuperAgentTest;

beforeAll(async (done) => {
    const {app, httpServer} = await require('../../src/server');
    server = httpServer
    agent = request.agent(server);

    await resetRuntimeTestData();
    await insertRuntimeTestData();
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
});