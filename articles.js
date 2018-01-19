/* útfæra greina virkni */
const express = require('express');
const articles = express.Router();
const marked = require('marked');
const fs = require('fs');
const fm = require('front-matter');

/*util to read the files*/
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

/*files*/
const encode = 'utf-8';
const batman = './articles/batman-ipsum.md';
const corporate = './articles/corporate-ipsum.md';
const deloren = './articles/deloren-ipsum.md';
const lorem = './articles/lorem-ipsum.md';


/* data*/
let data;


/*read function */
function read(file) {
  readFileAsync(file)
    .then((data) => {
      writedata(fm(data.toString(encode)));

    })
    .catch((error) => {
      console.log(error);
    });
}

function writedata(incoming){
  //console.log(incoming);
  data = incoming;
  console.log(data);
}


function readdata() {
  read(batman);
  read(corporate);
  read(deloren);
  read(lorem);

};

readdata();

articles.get('/', (req, res) => {


  res.render('index', {
    title: 'hallo this is awesome'
  });
});

module.exports = articles;
