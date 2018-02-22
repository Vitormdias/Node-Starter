const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

const handler = (err, req, res, next) => {
    const response = {
        code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env !== 'dev') {
        delete response.stack;
    }

    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.json(response);
    res.end();
};

exports.handler = handler;

exports.mongoErrorHandler = (error) => {
    if ((error.name === 'BulkWriteError' || error.name === 'MongoError') && error.code === 11000) {
        return new APIError({
            message: 'Unique field validation Error',
            status: httpStatus.CONFLICT
        });
    }

    if (error.name === 'ValidationError') {
        return new APIError({
            message: 'Required field not provided',
            status: httpStatus.BAD_REQUEST
        });
    }

    if (error.name === 'CastError') {
        return new APIError({
          message: 'Invalid data sent',
          status: httpStatus.BAD_REQUEST
        })
      }

    return error;
}
