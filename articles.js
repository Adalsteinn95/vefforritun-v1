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


/*store the useful data */ 



/*read function */
/*
async function read(file) {
  readFileAsync(file)
    .then((data) => {
      writedata(fm(data.toString(encode)));
    })
    .catch((error) => {
      console.log(error);
    });
}*/

async function makeDataUsable(incoming) {


  let useful_data = [];

  for (let i = 0; i < incoming.length; i++) {
    useful_data[i] = fm(incoming[i].toString(encode));
  }

  return useful_data;
}


async function readData() {
  let a;
  let b;
  let c;
  let d;

  try {
    a = await readFileAsync(batman);
    b = await readFileAsync(corporate);
    c = await readFileAsync(deloren);
    d = await readFileAsync(lorem);
  } catch (error) {
    console.log(error);
  }

  const final = await makeDataUsable([a, b, c ,d])
  
  return final;

};



articles.get('/', (req, res) => {


  readData()
  .then((data) => {

    
    res.render('index', {
      title: 'Greinar',
      info: 'Greinasafnið',
      data: data,
      date: "hello",
      
    });
  })
  .catch((error) => {

    res.render('error', {
      title: 'errorpage',
      info: 'Villa kom upp',
    });
  });


});


/*routes*/
articles.get('/*', (req, res) =>{

  res.render('error', {
    title: 'errorpage',
    info: 'Fannst ekki',
  });

});



module.exports = articles;

/*
async function main() {
  let data = '';
  try {
    data = await readFileAsync('data.txt');
  } catch (e) {
    console.error('error', e);
  }
  console.log(data.toString('utf8'));
}

main().catch(err => { console.error(err); });*/
