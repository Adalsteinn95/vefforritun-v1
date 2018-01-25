const express = require('express');
const path = require('path');

const app = express();
const routes = require('./articles');

const hostname = '127.0.0.1';
const port = 3000;

/*views*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/articles'));





app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use('/',routes);
