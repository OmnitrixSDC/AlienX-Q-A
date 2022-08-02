const db = require('../db');
// EXPLAIN ANALYZE
// SELECT
// questions.id AS question_id,
// questions.body AS question_body,
// questions.date_written AS question_date,
// questions.asker_name,
// questions.helpful AS question_helpfulness,
// questions.reported,
// (
// SELECT json_agg
//   (
//      json_build_object
//      (
//        'id', answers.id,
//        'body', answers.body,
//        'date', answers.date_written,
//        'answerer_name', answers.answerer,
//        'helpfulness', answers.helpful,
//        'photos', (
//         SELECT coalesce(json_agg
//          (photo_url
//          ) , '[]'::json) FROM photos WHERE photos.answer_id = answers.id
//          )
//        )
//   ) FROM answers WHERE answers.question_id = questions.id
//   ) as answers
// FROM questions
// WHERE questions.product_id = 123 AND
// questions.reported IS FALSE
// LIMIT 5
// OFFSET 0;
const getQuestionQuery = `
SELECT
questions.id AS question_id,
questions.body AS question_body,
questions.date_written AS question_date,
questions.asker_name,
questions.helpful AS question_helpfulness,
questions.reported,
(
SELECT json_agg
  (
     json_build_object
     (
       'id', answers.id,
       'body', answers.body,
       'date', answers.date_written,
       'answerer_name', answers.answerer,
       'helpfulness', answers.helpful,
       'photos', (
        SELECT coalesce(json_agg
         (photo_url
         ) , '[]'::json) FROM photos WHERE photos.answer_id = answers.id
         )
       )
  ) FROM answers WHERE answers.question_id = questions.id
  ) as answers
FROM questions
WHERE questions.product_id = $1 AND
questions.reported IS FALSE
LIMIT $2
OFFSET $3;
`;
function getQuestions(product_id, page, count) {
  const offset = (page*count) - count;
  const query = {
    name: 'get questions',
    text: getQuestionQuery,
    values: [product_id, count, offset],
  };
  return db.query(query);
}
exports.getQuestions= getQuestions;


// postQuestionQuery = `
// INSERT INTO questions (body, asker_name, asker_email, product_id, date_written) SELECT $1, $2, $3, $4, CURRENT_TIMESTAMP WHERE EXISTS (SELECT FROM questions WHERE product_id = $4);
// `;

postQuestionQuery = `
INSERT INTO questions(body, asker_name, asker_email, product_id, date_written) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP);
`;

function postQuestion(body, asker_name, asker_email, product_id) {
  const query = {
    name: 'post questions',
    text: postQuestionQuery,
    values: [body, asker_name, asker_email, Number(product_id)],
  };
  return db.query(query);
}
exports.postQuestion= postQuestion;


putHelpfulQuery = `
UPDATE questions
SET helpful=helpful+1
WHERE questions.id = $1;
`;

function putHelpful(question_id) {
  const query = {
    name: 'put helpful',
    text: putHelpfulQuery,
    values: [Number(question_id)],
  };
  return db.query(query);
}
exports.putHelpful = putHelpful;


putReportQuery = `
UPDATE questions
SET reported=true
WHERE questions.id = $1;
`;

function putReport(question_id) {
  const query = {
    name: 'put report',
    text: putReportQuery,
    values: [Number(question_id)],
  };
  return db.query(query);
}
exports.putReport= putReport;

