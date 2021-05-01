
var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
}

config.mongodb = {
  credentials: process.env.MONGODB_LOGIN,
  url: process.env.MONGODB_URL
}
if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}

config.google = 
{
  client: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_SECRET
}
// config.db same deal
// config.email etc
// config.log

config.imgur = {
  client: process.env.IMGUR_CLIENT_ID,
  secret: process.env.IMGUR_SECRET,
}