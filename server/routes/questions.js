const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions_controllers.js');
let {getQuestions, postQuestion, putHelpful, putReport} = questionsController;
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
  getQuestions(product_id, page, count).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
});

router.post('/qa/questions', (req, res) => {
  let product_id;
  if (req.body.product_id) {
    product_id = req.body.product_id;
  } else {
    res.send('Error: invalid product_id provided');
  }
  let name = req.body.name;
  let email = req.body.email;
  let body = req.body.body;
  postQuestion(body, name, email, product_id).then((data) => {
    res.send('Status: 201 CREATED');
  }).catch((err) => {
    res.send(err.message);
  });
});


router.put('/qa/questions/:question_id/helpful', (req, res) => {
  let question_id;
  if (req.body.question_id) {
    question_id = req.body.question_id;
  } else {
    res.send('Error: invalid question_id provided');
  }
  putHelpful(question_id).then((data) => {
    res.send('successfully posted');
  }).catch((err) => {
    res.send(err.message);
  });
});


router.put('/qa/questions/:question_id/report', (req, res) => {
  let question_id;
  if (req.body.question_id) {
    question_id = req.body.question_id;
  } else {
    res.send('Error: invalid question_id provided');
  }
  putReport(question_id).then((data) => {
    res.send('successfully posted');
  }).catch((err) => {
    res.send(err.message);
  });
});
module.exports = router;