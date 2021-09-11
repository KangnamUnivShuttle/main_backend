const {app, httpServer} = require('../../src/server');
import request from 'supertest';

afterEach(() => httpServer.close())

describe("GET /hello", () => {
    it('Simple hello world controller return hello world msg', done => {
        request(app).get('/hello')
        .then(result => {
            expect(result.status).toBe(200);
            expect(result.text).toBe('\"hello world!\"');

            done();
        })
    });
});