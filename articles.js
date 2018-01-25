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

    var date = useful_data[i].attributes.date.split(' ');
    useful_data[i].attributes.date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];


  }


  return useful_data;
}


async function readData(files) {

  data = [];

  try {
    for (let i = 0; i < files.length; i++) {
      if (files[i] === 'img') {

      } else {
        data.push(await readFileAsync('./articles/' + files[i]));
      }


    }
  } catch (error) {
    console.log(error);
  }


  return data;

};


articles.get('/', (req, res) => {

  fs.readdir(__dirname + "/articles", (err, files) => {

    readData(files)
      .then((data) => {
        makeDataUsable(data)
          .then((data) => {
            res.render('index', {
              title: 'greinar',
              info: 'Greinasafnid',
              data: data,
            });
          })
          .catch((error) => {
            res.render('error', {
              title: 'errorpage',
              info: 'Villa 2 kom upp',
            });
          });
      })
      .catch((error) => {
        res.render('error', {
          title: 'errorpage',
          info: 'Villa 1 kom upp',
        });
      });


  });


});


/*routes*/
articles.get('/:data', (req, res) => {

  const dest = req.params.data;

  fs.readdir(__dirname + "/articles", (err, files) => {
    readData(files)
      .then((data) => {
        makeDataUsable(data)
          .then((data) => {
            console.log(marked(data[0].body));
            res.render('article', {
              title: 'greinar',
              info: 'Greinasafnid',
              article: marked(data[0].body),
            });
          })
          .catch((error) => {
            res.render('error', {
              title: 'errorpage',
              info: 'Villa kom upp',
            });
          });
      })
      .catch((error) => {
        res.render('error', {
          title: 'errorpage',
          info: 'Villa kom upp',
        });
      });
  });


});



module.exports = articles;
