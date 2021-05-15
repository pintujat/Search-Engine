var express = require('express'), 
path = require('path'),
indexRouter = require('./routes/index'),
 cors = require("cors"),
app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);

module.exports = app;
