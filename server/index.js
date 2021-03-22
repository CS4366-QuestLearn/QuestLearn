
const port = 3000;
// const { createServer } = require("http");
var express = require('express')
var cors = require('cors')
var app = express()
var mongoose = require('mongoose')
var config = require('./config')
mongoose.connect(`mongodb+srv://${config.mongodb.credentials}@${config.mongodb.url}`, 
{useNewUrlParser: true}, { useUnifiedTopology: true })


app.get('/', (req, res) => res.send('Hello world'));
app.use(cors())
app.use('/api/example', require('./example/foobar'))
app.use('/api/google', require('./utils/google'))
// app.use('/api', require('./utils/auth'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));