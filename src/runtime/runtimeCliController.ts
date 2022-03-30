
import { exec, execFile, fork, spawn } from "child_process";
import logger from "../logger";
import { RuntimeControlModel } from "../models/runtime.model";

export function controlCLI(container: RuntimeControlModel): Promise<number> {
    return new Promise<number>((resolve, rejects) => {
        const process = spawn('jingisukan', ['service', '--name', container.container_name, '--path', `${container.path}`, '--status', container.container_state]);

        logger.debug(`[runtimeCliController] [containerStateControl] container : ${container.container_name} state: ${container.container_state}`)

        process.stdout.on('data', (data) => {
            logger.debug(`[runtimeCliController] [containerStateControl] ${data}`)
            // console.log(`spawn stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            logger.error(`[runtimeCliController] [containerStateControl] ${data}`)
        });
        process.on('exit', (code, signal) => {
            logger.debug(`[runtimeCliController] [containerStateControl] spawn on exit code: ${code} signal: ${signal}`)

            if (code === 0) {
                resolve(code)
            } else {
                rejects(new Error(`Exit code is not zero.`))
            }
        });
    })
}

export function genDockerfile(url: string, name: string, path: string = '.'): Promise<number> {
    return new Promise<number>((resolve, rejects) => {
        const process = spawn('jingisukan', ['dockerfile', '--url', url, '--name', name, '--path', path]);

        logger.debug(`[runtimeCliController] [genDockerfile] container : ${name}`)

        process.stdout.on('data', (data) => {
            logger.debug(`[runtimeCliController] [genDockerfile] ${data}`)
            // console.log(`spawn stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            logger.error(`[runtimeCliController] [genDockerfile] ${data}`)
        });
        process.on('exit', (code, signal) => {
            logger.debug(`[runtimeCliController] [genDockerfile] spawn on exit code: ${code} signal: ${signal}`)

            if (code === 0) {
                resolve(code)
            } else {
                rejects(new Error(`Exit code is not zero.`))
            }
        });
    })
}

export function genDockerCompose(name: string, path: string = '.', cpu: string = '0.1', ram: string = '128M', port: string = '15000'): Promise<number> {
    return new Promise<number>((resolve, rejects) => {
        const process = spawn('jingisukan', ['new', '--cpu', cpu, '--ram', ram, '--name', name, '--port', port, '--path', path]);

        logger.debug(`[runtimeCliController] [genDockerCompose] container : ${name}`)

        process.stdout.on('data', (data) => {
            logger.debug(`[runtimeCliController] [genDockerCompose] ${data}`)
            // console.log(`spawn stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            logger.error(`[runtimeCliController] [genDockerCompose] ${data}`)
        });
        process.on('exit', (code, signal) => {
            logger.debug(`[runtimeCliController] [genDockerCompose] spawn on exit code: ${code} signal: ${signal}`)

            if (code === 0) {
                resolve(code)
            } else {
                rejects(new Error(`Exit code is not zero.`))
            }
        });
    })
}

export function genEcoSystem(name: string, path: string = '.'): Promise<number> {
    return new Promise<number>((resolve, rejects) => {
        const process = spawn('jingisukan', ['ecosystem', '--name', name, '--path', path]);

        logger.debug(`[runtimeCliController] [genEcoSystem] container : ${name}`)

        process.stdout.on('data', (data) => {
            logger.debug(`[runtimeCliController] [genEcoSystem] ${data}`)
            // console.log(`spawn stdout: ${data}`);
        });
        process.stderr.on('data', (data) => {
            logger.error(`[runtimeCliController] [genEcoSystem] ${data}`)
        });
        process.on('exit', (code, signal) => {
            logger.debug(`[runtimeCliController] [genEcoSystem] spawn on exit code: ${code} signal: ${signal}`)

            if (code === 0) {
                resolve(code)
            } else {
                rejects(new Error(`Exit code is not zero.`))
            }
        });
    })
}