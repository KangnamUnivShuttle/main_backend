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
        const weatherPayload = JSON.parse(JSON.stringify(SAMPLE_KAKAO_REQ_OBJ))
        weatherPayload.userRequest.utterance = '오늘 날씨 어때?'
        agent.post('/runtime/kakaochat')
        .type('application/json')
        .send(SAMPLE_KAKAO_REQ_OBJ)
        .then(result => {
            expect(result.status).toBe(200);

            const data = JSON.parse(result.text)
            expect(data.version).toBe('2.0')
            expect(data.template.outputs.length).toBe(1)
            // console.log('asdf', JSON.stringify(data.template.outputs[0].listCard), 'fff', JSON.stringify(data.template.outputs[0]))
            expect(data.template.outputs[0].listCard.items.length).toBe(4)
            expect(data.template.quickReplies.length).toBe(1)
            done();
        })
    });
});