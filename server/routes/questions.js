const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions_controllers.js');
const {getQuestions, postQuestion, putHelpful, putReport} = questionsController;
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now());
//   next();
// });

router.get('/qa/questions', (req, res) => {
  let product_id;
  let page;
  let count;
  if (req.query.product_id) {
    product_id = req.query.product_id;
    if (req.query.page) {
      page = req.query.page;
    } else {
      page = 1;
    }
    if (req.query.count) {
      count = req.query.count;
    } else {
      count = 5;
    }
    if (isNaN(product_id) || isNaN(page) || isNaN(count)) {
      res.status(404).send('Error: invalid product_id provided');
      return;
    }
    getQuestions(product_id, page, count).then((data) => {
      if (data.name) {
        if (data.name === 'error') {
          res.status(404).send('Internal Server Error');
        }
      } else {
        const output = {
          product_id: product_id,
          results: data,
        };
        res.send(output);
      }
    }).catch((err) => {
      res.status(404).send('Internal Server Error');
    });
  } else {
    res.status(404).send('Internal Server Error');
  }
});

router.post('/qa/questions', (req, res) => {
  if (req.body.product_id) {
    const product_id = req.body.product_id;
    const name = req.body.name;
    const email = req.body.email;
    const body = req.body.body;
    if (isNaN(product_id) || isNaN(page) || isNaN(count)) {
      res.status(404).send('Error: invalid product_id provided');
      return;
    }
    postQuestion(body, name, email, product_id).then((data) => {
      if (data.name) {
        if (data.name === 'error') {
          res.status(404).send('Internal Server Error');
        }
      } else {
        res.status(201).send('Status: 201 CREATED');
      }
    }).catch((err) => {
      res.send(err.message);
    });
  } else {
    res.send('Error: invalid product_id provided');
  }
});


router.put('/qa/questions/:question_id/helpful', (req, res) => {
  let question_id;
  if (req.body.question_id) {
    question_id = req.body.question_id;
    putHelpful(question_id).then((data) => {
      if (data.name) {
        if (data.name === 'error') {
          res.status(404).send('Internal Server Error');
        }
      } else {
        res.send('Status: 204 NO CONTENT');
      }
    }).catch((err) => {
      res.send(err.message);
    });
  } else {
    res.send('Error: invalid question_id provided');
  }
});


router.put('/qa/questions/:question_id/report', (req, res) => {
  let question_id;
  if (req.body.question_id) {
    question_id = req.body.question_id;
    putReport(question_id).then((data) => {
      if (data.name) {
        if (data.name === 'error') {
          res.status(404).send('Internal Server Error');
        }
      } else {
        res.send('Status: 204 NO CONTENT');
      }
    }).catch((err) => {
      res.send(err.message);
    });
  } else {
    res.send('Error: invalid question_id provided');
  }
});
module.exports = router;
