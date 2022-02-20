import { createLogger, transports, format } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file'
import path from 'path'

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

const logFormat = format.combine(
    format.label({ label: `[chat-app #${process.pid}]` }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
)

const logDir = './log'

const logger = createLogger({
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      format: logFormat
    }),
    new WinstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, logDir, '/error'),
        filename: '%DATE%.error.log',
        maxSize: '5m',
        zippedArchive: true,
        format: logFormat
    }),
      // 모든 레벨 로그를 저장할 파일 설정
      new WinstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: path.join(__dirname, logDir, '/all'),
        filename: '%DATE%.all.log',
        maxSize: '5m',
        zippedArchive: true,
        format: logFormat
    })
  ]
});

export default logger;