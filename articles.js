/* packages */
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

/* endurtekningar */
const title = 'Greinasafnið';
const encode = 'utf-8';


async function makeDataUsable(incoming) {
  const usefulData = [];


  for (let i = 0; i < incoming.length; i += 1) {
    usefulData[i] = fm(incoming[i].toString(encode));
  }

  usefulData.sort((a, b) => Date.parse(b.attributes.date) - Date.parse(a.attributes.date));

  for (let i = 0; i < usefulData.length; i += 1) {
    const element = usefulData[i].attributes.date;

    const a = Date.parse(element);
    const b = new Date(a);
    usefulData[i].attributes.date = `${b.getDate()}.${b.getMonth() + 1}.${b.getFullYear()}`;
  }


  return usefulData;
}


async function readData(files) {
  const data = [];

  const regularExpression = new RegExp('[a-zA-Z]+.md$');
  for (let i = 0; i < files.length; i += 1) {
    if (regularExpression.test(files[i])) {
      data.push(readFileAsync(`./articles/${files[i]}`));
    }
  }

  const a = await Promise.all(data);
  return a;
}


async function readDirectory(directory) {
  const a = await readDir(directory);
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
                title: `${title}`,
                info: `${title}`,
                data: usableData,
              });
            })
            .catch(() => {
              res.render('error', {
                title: 'errorpage',
                info: 'Efnid fannst ekki',
              });
            });
        })
        .catch(() => {
          res.render('error', {
            title: 'errorpage',
            info: 'Villa kom up',
            errormsg: '',
          });
        });
    })
    .catch(() => {
      res.render('error', {
        title: 'error',
        info: 'Villa kom upp',
        errormsg: '',
      });
    });
});

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
                title: `${title}`,
                info: article[0].attributes.title,
                article: marked(article[0].body),
              });
            })
            .catch(() => {
              res.render('error', {
                title: 'errorpage',
                info: 'Fannst ekki',
                errormsg: 'Ó nei , efnið finnst ekki',
              });
            });
        })
        .catch(() => {
          res.render('error', {
            title: 'errorpage',
            info: 'Villa kom upp',
            errormsg: '',
          });
        });
    })
    .catch(() => {
      res.render('error', {
        title: 'errorpage',
        info: 'Villa kom upp',
        errormsg: '',
      });
    });
});
articles.get('*', (req, res) => {
  res.render('error', {
    title: 'errorpage',
    info: 'Fannst ekki',
    errormsg: 'Ó nei , efnið finnst ekki',
  });
});

module.exports = articles;
