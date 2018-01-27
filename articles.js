/* útfæra greina virkni */
const express = require('express');

const articles = express.Router();
const marked = require('marked');
const fs = require('fs');
const fm = require('front-matter');
const path = require('path');


/* util to read the files */
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

/* files */
const encode = 'utf-8';


async function makeDataUsable(incoming) {
  const usefulData = [];


  for (let i = 0; i < incoming.length; i += 1) {
    usefulData[i] = fm(incoming[i].toString(encode));
  }

  usefulData.sort((a, b) => Date.parse(a.attributes.date) - Date.parse(b.attributes.date));


  return usefulData;
}


async function readData(files) {
  const data = [];

  try {
    for (let i = 0; i < files.length; i += 1) {
      if (files[i] !== 'img') {
        data.push(readFileAsync(`./articles/${files[i]}`));
      }
    }
  } catch (error) {
    console.log(error);
  }

  const a = await Promise.all(data);
  return a;
}


articles.get('/', (req, res) => {
  fs.readdir(path.join(__dirname, '/articles'), (err, files) => {
    console.log(err);

    if (!err) {
      readData(files)
        .then((data) => {
          makeDataUsable(data)
            .then((usableData) => {
              res.render('index', {
                title: 'greinar',
                info: 'Greinasafnid',
                data: usableData,
              });
            })
            .catch((error) => {
              res.render('error', {
                title: 'errorpage',
                info: 'Efnid fannst ekki',
              });
            });
        })
        .catch((error) => {
          res.render('error', {
            title: 'errorpage',
            info: 'Efnid fannst ekki',
            errormsg: 'tello',
          });
        });
    } else {
      res.render('error',{
        title: 'error',
        info: 'Villa kom upp',
        errormsg: '',
      });
    }
  });
});

function filterArray(array, string) {
  const filtered = [];

  for (let i = 0; i < array.length; i += 1) {
    if (array[i].attributes.slug === string) {
      filtered.push(array[i]);
    }
  }

  return filtered;
}


/* routes */
articles.get('/:data', (req, res) => {
  const dest = req.params.data;


  fs.readdir(path.join(__dirname, '/articles'), (err, files) => {
    readData(files)
      .then((readdata) => {
        makeDataUsable(readdata)
          .then((data) => {
            const article = filterArray(data, dest);

            res.render('article', {
              title: 'greinar',
              info: article[0].attributes.title,
              article: marked(article[0].body),
            });
          })
          .catch((error) => {
            res.render('error', {
              title: 'errorpage',
              info: 'Fannst ekki',
              errormsg: 'Ó nei , efnið finnst ekki',
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
