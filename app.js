const express = require('express');
const path = require('path');

const app = express();
const routes = require('./articles');

const hostname = '127.0.0.1';
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/img', express.static(path.join(__dirname, 'articles/img')));

app.listen(port, hostname, () => {
});


app.use('/', routes);
