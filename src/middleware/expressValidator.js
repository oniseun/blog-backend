const ErrorResponse = require('../models/ErrorResponse')
const { StatusCodes } = require('http-status-codes')

module.exports = function expressValidator(err,req, res, next) {  

    if (err && err.error && err.error.message) {
        console.error('validation error::',err.error.message)
        // we had a joi error, let's return a custom 400 json response
        return res.status(StatusCodes.BAD_REQUEST).json( new ErrorResponse(err.error.message));

      } else {
        // pass on to another error handler
        next(err);
      }
    
}
