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
const readDir = util.promisify(fs.readdir);

/* files */
const encode = 'utf-8';


async function makeDataUsable(incoming) {
  const usefulData = [];


  for (let i = 0; i < incoming.length; i += 1) {
    usefulData[i] = fm(incoming[i].toString(encode));
  }

  usefulData.sort((a, b) => Date.parse(a.attributes.date) - Date.parse(b.attributes.date));


  for (let i = 0; i < usefulData.length; i++) {
    const element = usefulData[i].attributes.date;

    const a = Date.parse(element);
    const b = new Date(a);
  }


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

  /* check plz */
  data.filter((element) => {
    const regexp = new RegExp('.md', 'g');

    return regexp.test(element);
  });


  const a = await Promise.all(data);
  return a;
}


async function readDirectory(directory) {
  let a;
  try {
    a = await readDir(directory);
  } catch (error) {
    console.log(error);
  }
  return a;
}

function filterArray(array, string) {
  const filtered = [];

  for (let i = 0; i < array.length; i += 1) {
    if (array[i].attributes.slug === string) {
      filtered.push(array[i]);
    }
  }

  return filtered;
}


articles.get('/', (req, res) => {
  readDirectory(path.join(__dirname, '/articles'))
    .then((item) => {
      readData(item)
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
    })
    .catch((error) => {
      res.render('error', {
        title: 'error',
        info: 'Villa kom upp',
        errormsg: '',
      });
    });
});


/* routes */
articles.get('/:data', (req, res) => {
  const dest = req.params.data;
  readDirectory(path.join(__dirname, '/articles'))
    .then((files) => {
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
    })
    .catch((error) => {
      res.render('error', {
        title: 'errorpage',
        info: 'Villa kom upp',
      });
    });
});

module.exports = articles;
