import { exec, execFile, fork, spawn } from "child_process";
import logger from "../logger";
import { RuntimeControlModel } from "../models/runtime.model";

export function controlCLI(
  container: RuntimeControlModel
): Promise<{ code: number; msg: string }> {
  return new Promise<{ code: number; msg: string }>((resolve, rejects) => {
    const process = spawn("jingisukan", [
      "service",
      "--name",
      container.container_name,
      "--path",
      `${container.path}`,
      "--status",
      container.container_state,
    ]);

    logger.debug(
      `[runtimeCliController] [containerStateControl] container : ${container.container_name} state: ${container.container_state}`
    );

    let msg = "";

    process.stdout.on("data", (data) => {
      logger.debug(`[runtimeCliController] [containerStateControl] ${data}`);
      // console.log(`spawn stdout: ${data}`);
      msg += `\n${data}`;
    });
    process.stderr.on("data", (data) => {
      logger.error(`[runtimeCliController] [containerStateControl] ${data}`);
      msg += `\n${data}`;
    });
    process.on("exit", (code, signal) => {
      logger.debug(
        `[runtimeCliController] [containerStateControl] spawn on exit code: ${code} signal: ${signal}`
      );

      if (code === 0) {
        resolve({
          code,
          msg,
        });
      } else {
        rejects(new Error(`Exit code is not zero.`));
      }
    });
  });
}

export function genDockerfile(
  url: string,
  name: string,
  path: string = "."
): Promise<number> {
  return new Promise<number>((resolve, rejects) => {
    const process = spawn("jingisukan", [
      "dockerfile",
      "--url",
      url,
      "--name",
      name,
      "--path",
      path,
    ]);

    logger.debug(`[runtimeCliController] [genDockerfile] container : ${name}`);

    process.stdout.on("data", (data) => {
      logger.debug(`[runtimeCliController] [genDockerfile] ${data}`);
      // console.log(`spawn stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
      logger.error(`[runtimeCliController] [genDockerfile] ${data}`);
    });
    process.on("exit", (code, signal) => {
      logger.debug(
        `[runtimeCliController] [genDockerfile] spawn on exit code: ${code} signal: ${signal}`
      );

      if (code === 0) {
        resolve(code);
      } else {
        rejects(new Error(`Exit code is not zero.`));
      }
    });
  });
}

export function genDockerCompose(
  name: string,
  path: string = ".",
  cpu: string = "0.1",
  ram: string = "128M",
  port: string = "15000",
  env: string = "true"
): Promise<number> {
  return new Promise<number>((resolve, rejects) => {
    const process = spawn("jingisukan", [
      "new",
      "--cpu",
      cpu,
      "--ram",
      ram,
      "--name",
      name,
      "--port",
      port,
      "--path",
      path,
      "--env",
      env,
    ]);

    logger.debug(
      `[runtimeCliController] [genDockerCompose] container : ${name}`
    );

    process.stdout.on("data", (data) => {
      logger.debug(`[runtimeCliController] [genDockerCompose] ${data}`);
      // console.log(`spawn stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
      logger.error(`[runtimeCliController] [genDockerCompose] ${data}`);
    });
    process.on("exit", (code, signal) => {
      logger.debug(
        `[runtimeCliController] [genDockerCompose] spawn on exit code: ${code} signal: ${signal}`
      );

      if (code === 0) {
        resolve(code);
      } else {
        rejects(new Error(`Exit code is not zero.`));
      }
    });
  });
}

export function genEnvFile(
  name: string,
  path: string = ".",
  env: string[] = []
): Promise<number> {
  return new Promise<number>((resolve, rejects) => {
    const params = ["env", "--name", name, "--path", path];
    env.forEach((val) => {
      params.push("--data");
      params.push(val);
    });
    logger.debug(
      `[runtimeCliController] [genEnvFile] params: ${JSON.stringify(params)}`
    );
    const process = spawn("jingisukan", params);

    logger.debug(`[runtimeCliController] [genEnvFile] container : ${name}`);

    process.stdout.on("data", (data) => {
      logger.debug(`[runtimeCliController] [genEnvFile] ${data}`);
      // console.log(`spawn stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
      logger.error(`[runtimeCliController] [genEnvFile] ${data}`);
    });
    process.on("exit", (code, signal) => {
      logger.debug(
        `[runtimeCliController] [genEnvFile] spawn on exit code: ${code} signal: ${signal}`
      );

      if (code === 0) {
        resolve(code);
      } else {
        rejects(new Error(`Exit code is not zero.`));
      }
    });
  });
}

export function genEcoSystem(
  name: string,
  path: string = "."
): Promise<number> {
  return new Promise<number>((resolve, rejects) => {
    const process = spawn("jingisukan", [
      "ecosystem",
      "--name",
      name,
      "--path",
      path,
    ]);

    logger.debug(`[runtimeCliController] [genEcoSystem] container : ${name}`);

    process.stdout.on("data", (data) => {
      logger.debug(`[runtimeCliController] [genEcoSystem] ${data}`);
      // console.log(`spawn stdout: ${data}`);
    });
    process.stderr.on("data", (data) => {
      logger.error(`[runtimeCliController] [genEcoSystem] ${data}`);
    });
    process.on("exit", (code, signal) => {
      logger.debug(
        `[runtimeCliController] [genEcoSystem] spawn on exit code: ${code} signal: ${signal}`
      );

      if (code === 0) {
        resolve(code);
      } else {
        rejects(new Error(`Exit code is not zero.`));
      }
    });
  });
}
