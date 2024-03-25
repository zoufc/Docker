export const logger = require('pino')({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
