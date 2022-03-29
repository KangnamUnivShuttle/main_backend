import request from 'supertest';

export async function logIn(server: any): Promise<boolean> {
    const email = process.env.TEST_ID
    const passwd = process.env.TEST_PW

    const agent = request.agent(server);
    return agent.post('/auth')
        .type('application/json')
        .send({ email, passwd })
        .then(res => res.body.success as boolean)
}