
const port = 3000;
// const { createServer } = require("http");
var express = require('express')
var cors = require('cors')
var app = express()
var mongoose = require('mongoose')
var config = require('./config')
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
mongoose.connect(`mongodb+srv://${config.mongodb.credentials}@${config.mongodb.url}`, 
{useNewUrlParser: true}, { useUnifiedTopology: true }, {useFindAndModify:true})


app.get('/', (req, res) => res.send('Hello world'));

app.use('/api/login', require('./api/login/router'))
app.use('/api/example', require('./api/example/foobar'))
app.use('/api/quests', require('./api/quest/router'))
app.use('/api/google', require('./utils/google'))
// app.use('/api', require('./utils/auth'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));