import { ILogger } from "./ILogger";
import * as winston from "winston";

class Logger implements ILogger {
  private config: string;
  private logger: winston.transports.HttpTransportInstance | undefined;

  constructor() {
    this.config = process.env.ENV || "dev";
  }

  public debug(msg: any): void {
    this.logger
      ? null
      : console.debug(
          "\x1b[34m",
          `${new Date().toISOString().split("T")[0]} - ${msg}`,
          "\x1b[0m"
        );
  }
  public info(msg: any): void {
    this.logger
      ? null
      : console.info(
          "\x1b[33m",
          `${new Date().toISOString().split("T")[0]} - ${msg}`,
          "\x1b[0m"
        );
  }
  public log(msg: any): void {
    this.logger
      ? null
      : console.log(
          "\x1b[37m",
          `${new Date().toISOString().split("T")[0]} - ${msg}`,
          "\x1b[0m"
        );
  }
  public error(msg: any): void {
    this.logger
      ? null
      : console.error(
          "\x1b[31m",
          `${new Date().toISOString().split("T")[0]} - ${msg}`,
          "\x1b[0m"
        );
  }
}

export default new Logger();
