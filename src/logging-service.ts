import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const esTransportOpts = {
  level: 'info',
  clientOpts: { node: 'http://localhost:9200' },
  indexPrefix: 'crm-logs'
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'crm-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new ElasticsearchTransport(esTransportOpts)
  ],
});

export default logger;
