'use strict'
const AppController = require('./controllers/AppController')
const validator = require('express-joi-validation').createValidator({ passError: true})
const Schema = require('./models/validators/schema');

module.exports = function(app) {
///////////////////////
// HEALTH CHECK
///////////////////////
app.get('/', AppController.getHealth)
app.get('/health', AppController.getHealth)
app.get('/api/health', AppController.getHealth)
app.get('/api/ping', AppController.ping)


/// ////////////////////////
// SERVICE ROUTES
/// ////////////////////////

app.get('/api/posts', validator.query(Schema.query), AppController.getPosts)

}