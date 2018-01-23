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

async function readDirectory() {
  let files = [];
  fs.readdir(__dirname + '/articles', function (err, items) {
    
    for (var i = 0; i < items.length; i++) {
      files[i] = items[i];
    }
    
  });

  return files;
}


async function makeDataUsable(incoming) {

  let useful_data = [];

  for (let i = 0; i < incoming.length; i++) {
    useful_data[i] = fm(incoming[i].toString(encode));

    var date = useful_data[i].attributes.date.split(' ');

    useful_data[i].attributes.date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];



  }

  return useful_data;
}


async function readData(list) {

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

  const test = readDirectory();
  console.log(test);

  const final = await makeDataUsable([a, b, c, d])

  return final;

};

readDirectory()
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {

    });

articles.get('/', (req, res) => {

  

  /*readData([batman, corporate, deloren, lorem])
    .then((data) => {
      res.render('index', {
        title: 'Greinar',
        info: 'Greinasafnið',
        data: data,
      });
    })
    .catch((error) => {
      res.render('error', {
        title: 'errorpage',
        info: 'Villa kom upp',
      });
    });*/


});


/*routes*/
articles.get('/:data', (req, res) => {

  const dest = req.params.data;

  console.log(dest);


  readData()
    .then((data) => {
      res.render('index', {
        title: 'Greinar',
        info: dest,
        data: data,
      });

    })
    .catch((error) => {
      res.render('error', {
        title: 'errorpage',
        info: 'Villa kom upp',
      });
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
