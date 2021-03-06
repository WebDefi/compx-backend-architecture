export interface ILogger {
  debug(msg: string): void;
  info(msg: string): void;
  log(msg: string): void;
  error(msg: string): void;
}
