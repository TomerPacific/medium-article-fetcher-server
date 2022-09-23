import express from 'express';

const bodyParser = require('body-parser');
const cors = require('cors');
const { parse } = require('rss-to-json');
const port = process.env.PORT || 3000;

const app = express();
const baseURL = "https://medium.com/feed/@";

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return next();
});

app.use(cors({
  credentials: true,
  origin: 'https://tomerpacific.github.io'
}));

app.get('/medium/*', ((req, res) => {
  let mediumUserName = req.params[0];
  if (!mediumUserName) {
    return res.status(404).send({'message': 'No username received'});
  }
  
  let url = baseURL + mediumUserName;

  parse(url).then(rss => {
    return res.status(200).send({'message': rss});
  }).catch(error => {
    return res.status(404).send({"message": error});
  });
}));

app.listen(port, () => {
  return console.log(`MediumArticleFetcher is listening at ${port}`);
});
