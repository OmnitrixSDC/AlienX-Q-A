const db = require('../db');
const questionQuery = `
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
OFFSET $3
`;


function getQuestions(product_id, page, count) {
  const offset = (page*count) - count;
  const query = {
    name: 'get answers',
    text: questionQuery,
    values: [product_id, count, offset],
  };
  return db.query(query);
}
exports.getQuestions= getQuestions;
