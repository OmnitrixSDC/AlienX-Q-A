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

const postAnswerQuery = `
INSERT INTO answers (body, answerer, email, question_id, date_written) SELECT $1, $2, $3, $4, CURRENT_TIMESTAMP WHERE EXISTS (SELECT FROM answers WHERE question_id = $4);
`;

const postPhotoQuery = `
INSERT INTO photos (photo_url, answer_id) VALUES ($1, (select max(id) from answers));
`;
// setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);
function postAnswer(body, asker_name, asker_email, question_id, photo_url_arr) {
  const query = {
    name: 'post answer',
    text: postAnswerQuery,
    values: [body, asker_name, asker_email, Number(question_id)],
  };
  let promiseArr = [];
  for (let i = 0; i < photo_url_arr.length; i++) {
    const photoQuery = {
      name: 'post photo',
      text: postPhotoQuery,
      values: [photo_url_arr[i]],
    };
    promiseArr.push(db.query(photoQuery));
  }
  return db.query(query).then(() => {
    return Promise.all(promiseArr);
  });
}
exports.postAnswer = postAnswer;


putHelpfulQuery = `
UPDATE answers
SET helpful=helpful+1
WHERE answers.id = $1;
`;

function putHelpful(answer_id) {
  const query = {
    name: 'put helpful',
    text: putHelpfulQuery,
    values: [Number(answer_id)],
  };
  return db.query(query);
}
exports.putHelpful = putHelpful;


putReportQuery = `
UPDATE answers
SET reported=true
WHERE answers.id = $1;
`;

function putReport(answer_id) {
  const query = {
    name: 'put report',
    text: putReportQuery,
    values: [Number(answer_id)],
  };
  return db.query(query);
}
exports.putReport= putReport;

