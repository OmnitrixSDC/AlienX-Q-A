const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answers_controllers.js');
const {getAnswers, postAnswer} = answersController;

router.get('/qa/questions/:question_id/answers', (req, res) => {
  let question_id;
  let page;
  let count;
  if (req.query.question_id) {
    question_id = req.query.question_id;
  } else {
    res.send('Error: invalid product_id provided');
  }
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
  getAnswers(question_id, page, count).then((data) => {
    const output = {
      question: question_id,
      page: page,
      count: count,
      results: data,
    };
    res.send(output);
  }).catch((err) => {
    res.send(err);
  });
});

router.post('/qa/questions/:question_id/answers', (req, res) => {
  let product_id;
  let name;
  let email;
  let body;
  if (req.body.product_id) {
    product_id = req.body.product_id;
  } else {
    res.send('Error: invalid');
  }

  postAnswer(body, name, email, product_id).then((data) => {
    res.send('Status: 201 CREATED');
  }).catch((err) => {
    res.send(err);
  });
});


module.exports = router;
