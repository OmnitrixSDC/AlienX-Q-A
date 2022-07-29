const db = require('../db');

function getQuestions(product_id, page, count) {
  // text: 'SELECT * FROM questions WHERE id IN $1 LIMIT $2',

  // id SERIAL UNIQUE PRIMARY KEY,
  // product_id INTEGER NOT NULL,
  // body CHARACTER VARYING(1000),
  // date_written BIGINT NOT NULL,
  // asker_name CHARACTER VARYING(60) NOT NULL,
  // asker_email TEXT NOT NULL,
  // reported BOOLEAN NOT NULL DEFAULT FALSE,
  // helpful INTEGER NOT NULL DEFAULT 0

// 'SELECT p.id, p.body, p.date_written, p.asker_name, p.asker_email, p.reported, p.helpful from questions.questions p WHERE product_id = $1 LIMIT $2 OFFSET $3'

// 'SELECT TOP $2 id, product_id, body, date_written, asker_name, asker_email, reported, helpful from questions.questions WHERE product_id = $1 OFFSET $3',

// 'SELECT TOP $2 id AS question_id, body AS question_body, date_written AS question_date, asker_name, reported, helpful AS question_helpfulness WHERE product_id = $1 OFFSET $3'

let text = `
SELECT
id AS question_id,
body AS question_body,
date_written AS question_date,
asker_name,
reported,
helpful AS question_helpfulness
FROM questions
WHERE reported IS FALSE AND
product_id = $1
LIMIT $2
`;
  let query = {
    name: 'get questions',
    text: text,
    values: [product_id, count],
  };
  // let query = 'SELECT * FROM questions WHERE product_id = 40364';
  return db.query(query);
};

exports.getQuestions = getQuestions;