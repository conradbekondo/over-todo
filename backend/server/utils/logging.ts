import winston from "winston";
import { H3Event } from "h3";

export function useLogger(event?: H3Event) {
  const level = useRuntimeConfig(event).logLevel;

  let transports;

  if (import.meta.dev) {
    transports = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.cli()
        ),
      }),
    ];
  } else {
    transports = [
      new winston.transports.File({
        format: winston.format.combine(winston.format.json()),
      }),
    ];
  }

  const logger = winston.createLogger({
    level,
    transports,
  });

  return logger;
}
