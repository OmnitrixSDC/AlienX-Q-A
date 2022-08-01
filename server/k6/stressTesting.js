import http from 'k6/http';
import {sleep, check} from 'k6';

// export const options = {
//   stages: [
//     // {duration: '.001m', target: 100}, // below normal load
//     {duration: '1m', target: 1000}, // below normal load
//     // { duration: '5m', target: 100 },
//     // { duration: '2m', target: 200 }, // normal load
//     // { duration: '5m', target: 200 },
//     // { duration: '2m', target: 300 }, // around the breaking point
//     // { duration: '5m', target: 300 },
//     // { duration: '2m', target: 400 }, // beyond the breaking point
//     // { duration: '5m', target: 400 },
//     // { duration: '10m', target: 0 }, // scale down. Recovery stage.
//   ],
// };

export const options = {
  discardResponseBodies: true,
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '3s',
      preAllocatedVUs: 100,
      maxVUs: 1000,
    },
    // VUs: 1,
  },
};

export default function() {
  const BASE_URL = 'http://localhost:3000'; // make sure this is not production
  const params = {
    product_id: 4238,
    page: 1,
    count: 5,
  };
  const payload = {
    body: 'YOOOOO WASSUP',
    name: 'Miw :)',
    email: 'bofa@gmail.com',
    product_id: '4238',
  };
  const paramURL = '?product_id=' + params.product_id + '&page=' + params.page + '&count=' + params.count;

  const putParams = {
    question_id: 45224,
  };

  const params2 = {
    question_id: 52345,
    page: 1,
    count: 5,
  };
  const payload2 = {
    body: 'YOOOOO WASSUP',
    name: 'Miw :)',
    email: 'bofa@gmail.com',
    question_id: 52345,
    photos: ['hi.com'],
  };
  const paramURL2 = '?question_id=' + params2.question_id + '&page=' + params2.page + '&count=' + params2.count;

  const putParams2 = {
    answer_id: 254,
  };

  const responses = http.batch([
    ['GET', `${BASE_URL}/qa/questions` + paramURL, params, null],
    // ['POST', `${BASE_URL}/qa/questions`, payload, null],
    // ['PUT', `${BASE_URL}/qa/questions/` + putParams.question_id+ `/helpful`, putParams, null],
    // ['PUT', `${BASE_URL}/qa/questions/` + putParams.question_id+ `/report`, putParams, null],

    // ['GET', `${BASE_URL}/qa/questions/`+params2.question_id+`/answers` + paramURL2, params2, null],
    // ['POST', `${BASE_URL}/qa/questions/`+params2.question_id+`/answers`, payload2, null],
    // ['PUT', `${BASE_URL}/qa/answers/` + putParams2.answer_id+ `/helpful`, putParams2, null],
    // ['PUT', `${BASE_URL}/qa/answers/` + putParams2.answer_id+ `/report`, putParams2, null],
  ]);

  check(responses[0], {'get questions: status was 200': (r) => r.status == 200});
  // check(responses[0], {'post questions: status was 201': (r) => r.status == 201});

  // check(responses[0], {'put questions-helpful: status was 204': (r) => r.status == 204});
  // check(responses[0], {'put questions-report: status was 204': (r) => r.status == 204});
  // check(responses[0], {'get answers: status was 200': (r) => r.status == 200});
  // check(responses[0], {'post answers: status was 201': (r) => r.status == 201});
  // check(responses[0], {'put answers-helpful: status was 204': (r) => r.status == 204});
  // check(responses[0], {'put answers-report: status was 204': (r) => r.status == 204});
  sleep(1);
}
