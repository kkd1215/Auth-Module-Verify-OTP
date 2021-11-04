require('dotenv').config();

// connect to db
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const compress = require('compression')
const HTTPStatus = require('http-status');

const app = express();

// config variables
const CONFIG = require('./config');

// LIB
const logger = require('./lib/logger');

//Routes
const APIRoutes = require('./api')

// APIError Class
const APIError = require('./lib/api-error');

// connect to mongo db
mongoose.set('useCreateIndex', true);
mongoose.connect(CONFIG.dbUrl, {
  keepAlive: 1,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: Promise,
  useFindAndModify: false,
});
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${CONFIG.dbUrl}`);
});

//Middlewares
app.use(express.json()) 
// Morgan
app.use(morgan('dev'));

app.use(compress());
app.use(methodOverride());
app.use(helmet());

app.use(cors());

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public/')));

if (CONFIG.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true,
  }));
}


// Server status CHECK
const START_TIME = Date.now();

app.get('/status-check', async (req, res, next) => {
  const { version } = require('../package.json');
  res.status(200).json({
    version,
    startTime: START_TIME,
    upTime: Date.now() - START_TIME,
  });
});

app.use('/api', APIRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    return res.status(err.status).json({
      error: {
        message: unifiedErrorMessage,
        status: err.status,
        data: err.data,
        stack: CONFIG.env === 'development' ? err.stack : {},
      },
    });
  } if (!(err instanceof APIError)) {
    return res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        message: err.message,
        status: err.status || 500,
        data: err.data,
        stack: CONFIG.env === 'development' ? err.stack : {},
      },
      statusCode: err.status || 500,
    });
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', HTTPStatus.NOT_FOUND);
  return next(err);
});

if (CONFIG.env === 'development') {
  app.use(expressWinston.errorLogger({
    winstonInstance: logger,
  }));
}

app.use((err, req, res, next) => res.status(err.status).json({
  error: {
    message: err.message,
    status: err.status,
    data: err.data,
    stack: CONFIG.env === 'development' ? err.stack : {},
  },
  statusCode: err.status,
}));

const start = () => {
  app.listen(CONFIG.port, async err => {
    if (err) {
      logger.error(err);
      throw err;
    }
    logger.info(`server started on port ${CONFIG.port} (${CONFIG.env})`);
  });
};

start();