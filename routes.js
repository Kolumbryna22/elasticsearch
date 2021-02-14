const express = require('express');
const router = express.Router();
const elastic = require('elasticsearch');
const bodyParser = require('body-parser').json();
const users = require('./seeds');
const elasticClient = elastic.Client({
  host: 'localhost:9200',
  log: 'trace'
});

users.forEach((user) => {
  elasticClient.index({
    index: 'users',
    body: user
  });
});

router.use((req, res, next) => {
  elasticClient.index({
    index: 'logs',
    body: {
      url: req.url,
      method: req.method
    }
  })
    .then((res) => {
      console.log('Logs indexed');
    })
    .catch((e) => {
      console.log(e);
    });

  next();
});

router.post('/users', bodyParser, (req, res) => {
  elasticClient.index({
    index: 'users',
    body: req.body
  })
    .then((resp) => {
      return res.status(200).json({
        msg: 'user indexed'
      });
    })
    .catch((e) => {
      return res.status(500).json({
        msg: 'Error',
        e
      });
    });
});

router.get('/users/:id', (req, res) => {
  let query = {
    index: 'users',
    id: req.params.id
  };

  elasticClient.get(query)
    .then((resp) => {
      if (!resp) {
        return res.status(404).json({
          user: resp
        });
      }

      return res.status(200).json({
        user: resp
      });
    })
    .catch((e) => {
      return res.status(500).json({
        msg: 'Error not found',
        e
      });
    });
});

router.put('/users/:id', bodyParser, (req, res) => {
  elasticClient.update({
    index: 'users',
    id: req.params.id,
    body: {
      doc: req.body
    }
  })
    .then((resp) => {
      return res.status(200).json({
        msg: 'user updated'
      });
    })
    .catch((e) => {
      return res.status(500).json({
        msg: 'Error',
        e
      });
    });
});

router.delete('/users/:id', (req, res) => {
  elasticClient.delete({
    index: 'users',
    id: req.params.id
  })
    .then((resp) => {
      return res.status(200).json({
        msg: 'user deleted'
      });
    })
    .catch((e) => {
      return res.status(500).json({
        msg: 'Error',
        e
      });
    });
});

router.get('/users', (req, res) => {
  let query = {
    index: 'users',
    size: 100
  };

  if (req.query.user) {
    query.q = `*${req.query.user}*`;
  }

  elasticClient.search(query)
    .then((resp) => {
      return res.status(200).json({
        users: resp.hits.hits
      });
    })
    .catch((e) => {
      return res.status(500).json({
        msg: 'Error',
        e
      });
    });
});

module.exports = router;
