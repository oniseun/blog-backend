'use strict'
const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require("express-rate-limit")
const expressValidator = require('./middleware/expressValidator')

app.use(express.json({limit: '20mb'}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to  60 requests per windowMs
});
   
  //  apply to all requests
app.use(limiter);
app.use(helmet())
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST']
  }))
morgan.token('payload', (req) => `${JSON.stringify(req.params)} - ${JSON.stringify(req.query)}`)
const logger = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":payload"')
app.use(logger)

require('./routes')(app)

app.use(expressValidator)

module.exports = app
