const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions_controllers.js');
let {getQuestions} = questionsController;
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

module.exports = router;