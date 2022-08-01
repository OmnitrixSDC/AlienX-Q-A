const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answers_controllers.js');
const {getAnswers, postAnswer, putHelpful, putReport} = answersController;

router.get('/qa/questions/:question_id/answers', (req, res) => {
  let question_id;
  let page;
  let count;
  if (req.query.question_id) {
    question_id = req.query.question_id;
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
      if (data.name) {
        if (data.name === 'error') {
          res.status(404).send('Internal Server Error');
        }
      } else {
        const output = {
          question: question_id,
          page: page,
          count: count,
          results: data,
        };
        res.status(201).send(output);
      }
    }).catch((err) => {
      res.send(err);
    });
  } else {
    res.status(404).send('Error: invalid product_id provided');
  }
});

router.post('/qa/questions/:question_id/answers', (req, res) => {
  if (req.body.question_id) {
    const question_id = req.body.question_id;
    const name = req.body.name || '';
    const email = req.body.email || '';
    const body = req.body.body || '';
    const photos = req.body.photos || [];
    if (isNaN(name) || isNaN(email) || isNaN(body) || Array.isArray(photos)) {
      postAnswer(body, name, email, question_id, photos).then((data) => {
        if (data.name) {
          if (data.name === 'error') {
            res.status(404).send('Internal Server Error');
          }
        } else {
          res.status(201).send('Status: 201 CREATED');
        }
      }).catch((err) => {
        res.status(404).send(err);
      });
    } else {
      res.status(404).send('Error: invalid input');
    }
  } else {
    res.send('Error: invalid');
  }
});


router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let answer_id;
  if (req.body.answer_id) {
    answer_id = req.body.answer_id;
    putHelpful(answer_id).then((data) => {
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
    res.send('Error: invalid answer_id provided');
  }
});


router.put('/qa/answers/:answer_id/report', (req, res) => {
  let answer_id;
  if (req.body.answer_id) {
    answer_id = req.body.answer_id;
    putReport(answer_id).then((data) => {
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
    res.send('Error: invalid answer_id provided');
  }
});
module.exports = router;
