const db = require('../db');
const answerQuery = `
SELECT
  answers.id,
  answers.body,
  answers.date_written AS date,
  answers.answerer AS answerer_name,
  answers.helpful AS helpfulness,
  (
    SELECT coalesce(json_agg
     (
        json_build_object
        (
          'url', photos.photo_url,
          'id', photos.id
        )
     ) , '[]'::json) FROM photos WHERE photos.answer_id = answers.id
     ) as photos
FROM answers
WHERE
  answers.question_id = $1
  AND answers.reported IS FALSE
LIMIT $2
OFFSET $3;
`;

function getAnswers(question_id, page, count) {
  const offset = (page*count) - count;
  const query = {
    name: 'get answers',
    text: answerQuery,
    values: [question_id, count, offset],
  };
  return db.query(query);
}
exports.getAnswers= getAnswers;