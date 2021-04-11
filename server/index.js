
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

// USER ROUTES
// TODO: Rename login -> user
app.use('/api/login', require('./api/login/router'))

// CLASSROOM AND QUEST ROUTE
app.use('/api/classroom', require('./api/classroom/router'))
app.use('/api/example', require('./api/example/foobar'))

// TODO: deprecate this
app.use('/api/quests', require('./api/quest/router'))

// GOOGLE CLASSROOM API ROUTE
// Mostly for pubsub and testing
app.use('/api/google', require('./utils/google'))

// QUESTLEARN USER ROUTE
// Contains information about usertype
app.use('/api/questlearn', require('./utils/questlearn-user'))


// app.use('/api', require('./utils/auth'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));