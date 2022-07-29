const db = require('../db');

function getQuestions(product_id, page, count) {
  const text = `
SELECT
questions.id AS question_id,
questions.body AS question_body,
questions.date_written AS question_date,
questions.asker_name,
questions.reported,
questions.helpful AS question_helpfulness
FROM questions
WHERE questions.product_id = $1 AND
questions.reported IS FALSE
LIMIT $2
OFFSET $3
`;
  let offset;
  if (page === 1) {
    offset = 0;
  } else {
    offset = (page-1)*count;
  }
  const query = {
    name: 'get questions',
    text: text,
    values: [product_id, count, offset],
  };
  // let query = 'SELECT * FROM questions WHERE product_id = 40364';
  return db.query(query);
};

exports.getQuestions = getQuestions;
