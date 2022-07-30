const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answers_controllers.js');
let {getAnswers} = answersController;

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
    let output = {
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


module.exports = router;