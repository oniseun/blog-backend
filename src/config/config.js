const config = {}
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const envfile = path.resolve(__dirname,`../../.env`)

if (fs.existsSync(envfile)) {
    dotenv.config()
}

config.app = {
    name: "Hatchways Backend Challenge",
    env: process.env.NODE_ENV|| 'development',
    port: process.env.PORT || 7200,
    logLevel: process.env.APP_LOG_LEVEL || 'debug',
    blogEndpoint : process.env.BLOG_POST_ENDPOINNT || 'https://api.hatchways.io/assessment/blog/posts',
    
}

config.cache = {
  stdTTL: process.env.CACHE_TTL || 3600,
  checkperiod: process.env.CACHE_CHECK_PERIOD || 600
}

module.exports = config;
