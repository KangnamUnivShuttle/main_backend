import axios, { AxiosResponse } from 'axios';
import logger from '../logger';

export function postRequestToInstance(instanceName: string, payload: any, port: number = 10000, timeout: number = 1000, route: string = 'chat') {
    logger.debug(`[internalRequest] [postRequestToInstance] Send payload to ${instanceName}:${port}, data:`, payload)
    return new Promise<any>((resolve, reject) => {

        const instance = axios.create({
            baseURL: `http://${instanceName}:${port}/`,
            timeout,
        });

        instance.post(route, payload)
        .then((res: AxiosResponse) => {
            logger.info(`[internalRequest] [postRequestToInstance] Response status: ${res.status}`)
            if (res.status !== 200 || !res.data) {
                throw new Error(`${instanceName}:${port} response status: ${res.status} or data null ${!res.data}`)
            } else {
                logger.info(`[internalRequest] [postRequestToInstance] return response data`)
                return res.data
            }
        })
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            logger.error(`[internalRequest] [postRequestToInstance] Error! ${err.message}`)
            reject(err)
        })
    })
}