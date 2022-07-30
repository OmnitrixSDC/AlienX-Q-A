const db = require('../db');

// SELECT
// questions.id AS question_id,
// questions.body AS question_body,
// questions.date_written AS question_date,
// questions.asker_name,
// questions.helpful AS question_helpfulness,
// questions.reported
// FROM questions
// WHERE questions.product_id = 2342 AND
// questions.reported IS FALSE
// LIMIT 5
// OFFSET 0;

const questionQuery = `
SELECT
questions.id AS question_id,
questions.body AS question_body,
questions.date_written AS question_date,
questions.asker_name,
questions.helpful AS question_helpfulness,
questions.reported
FROM questions
WHERE questions.product_id = $1 AND
questions.reported IS FALSE
LIMIT $2
OFFSET $3
`;
const answerQuery = `
SELECT
answers.id,
answers.body,
answers.date_written AS date,
answers.answerer AS answerer_name,
answers.helpful AS helpfulness
FROM answers
WHERE answers.question_id = $1
`;
const photoQuery = `
SELECT
photos.photo_url
FROM photos
WHERE photos.answer_id = $1
`;

function getQuestions(product_id, page, count) {
  const offset = (page*count) - count;

  const output = {
    product_id: product_id,
    results: [],
  };

  const query = {
    name: 'get questions',
    text: questionQuery,
    values: [product_id, count, offset],
  };

  const query3 = {
    name: 'get photos',
    text: photoQuery,
    values: [],
  };

  db.query(query).then((data) => {
    output.results = data;
    const promiseArr = [];
    for (let i = 0; i < data.length; i++) {
      const query2 = {
        name: 'get answers',
        text: answerQuery,
        values: [data[i].question_id],
      };
      promiseArr.push(db.query(query2));
    }
    return Promise.all(promiseArr);
  }).then((data) => {
    const promiseArr = [];
    for (let i = 0; i < data.length; i++) {
      output.results[i].answers = {};
      for (let j = 0; j < data[i].length; j++) {
        const answer_id = data[i][j].id;
        output.results[i].answers[answer_id] = data[i][j];
        const query3 = {
          name: 'get photos',
          text: photoQuery,
          values: [answer_id],
        };
        promiseArr.push(db.query(query3));
      }
    }
    return Promise.all(promiseArr);
  }).then((data) => {
    const {results} = output;
    const photosPromises = [];
    results.forEach((question) => {
      Object.keys(question.answers).forEach((id) => {
        let query3 = {
          name: 'get photos',
          text: photoQuery,
          values: [id],
        };
        photosPromises.push(db.query(query3)
            .then((photosResults) => {
              question.answers[id].photos = photosResults;
            }));
      });
    });
    return Promise.all(photosPromises);
  }).then((data) => {
    debugger;
  }).catch((e) => console.error(e.stack));
};


// function getQuestions(product_id, page, count) {
//   const offset = (page*count) - count;
//   const query1 = {
//     name: 'get questions',
//     text: questionQuery,
//     values: [product_id, count, offset],
//   };
//   // let query = 'SELECT * FROM questions WHERE product_id = 40364';
//   // Questions query
//   const questionQ = db.query(query1);
//   // Answers query
//   const answerQ = questionQ.then((data) => {
//     const promiseArr = [];
//     for (let i = 0; i < data.length; i++) {
//       const q2 = {
//         name: 'get answers',
//         text: answerQuery,
//         values: [data[i].question_id],
//       };
//       promiseArr.push(db.query(q2));
//     }
//     return Promise.all(promiseArr);
//   });
//   // Photos query
//   const photoQ = answerQ.then((data) => {
//     const promiseArr = [];
//     for (let i = 0; i < data.length; i++) {
//       for (let j = 0; j < data[i].length; j++) {
//         const q3 = {
//           name: 'get photos',
//           text: photoQuery,
//           values: [data[i][j].id],
//         };
//         promiseArr.push(db.query(q3));
//       }
//     }
//     return Promise.all(promiseArr);
//   });
//   let lastPromiseArr = [questionQ, answerQ, photoQ];
//   return Promise.all(lastPromiseArr);
// };

exports.getQuestions = getQuestions;
