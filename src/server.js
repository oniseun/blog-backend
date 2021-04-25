'use strict'
const app = require('./app')
const config = require('./config/config')

app.listen(config.app.port, function() {
  console.warn(`APP "${config.app.name}" STARTED AS: ${config.app.env}, listening on port: ${config.app.port}`)
  console.warn('=========================================================================\n')
})