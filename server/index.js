
const port = 3000;
// const { createServer } = require("http");
var express = require('express')
var cors = require('cors')
var app = express()
// var config = require('./config')
// var mongoose = require('mongoose')


app.get('/', (req, res) => res.send('Hello world'));
app.use(cors())
app.use('/api', require('./example/foobar'))
app.use('/api/google', require('./utils/google'))
// app.use('/api', require('./utils/auth'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));