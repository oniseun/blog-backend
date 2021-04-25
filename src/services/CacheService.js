
const config = require('../config/config')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( config.cache );

module.exports = myCache