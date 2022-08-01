const request = require('supertest')('localhost:3000');
const expect = require('chai').expect;

describe('GET /qa/questions', function() {
  it('returns object', async function() {
    const params = {
      product_id: 32423,
      page: 1,
      count: 5,
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.status).to.eql(201);
    expect(response.body.results.length).to.eql(5);
  });

  it('returns length of 0 and success', async function() {
    const params = {
      product_id: 32423,
      page: 0,
      count: 0,
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.status).to.eql(201);
    expect(response.body.results.length).to.eql(0);
  });

  it('should error if given invalid product_id', async function() {
    const params = {
      product_id: 'f',
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.status).to.eql(404);
    expect(response.text).to.eql('Error: invalid product_id provided');
  });

  it('should throw internal error if product not found', async function() {
    const params = {
      product_id: '2974502582758',
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.status).to.eql(404);
    expect(response.text).to.eql('Internal Server Error');
  });

  it('should have the right structure and type', async function() {
    const params = {
      product_id: '2448',
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.body.results).to.exist;
    expect(response.body.product_id).to.exist;
    expect(response.body.results[0].question_id).to.exist;
    expect(response.body.results[0].answers).to.exist;
    expect(response.body.results[0].answers[0].photos.length).to.equal(0);
  });
});

describe('GET /qa/questions/:question_id/answers', function() {
  it('returns object', async function() {
    const params = {
      question_id: 123,
      page: 1,
      count: 5,
    };
    const response = await request.get('/qa/questions/'+params.question_id+'/answers').query(params);
    expect(response.status).to.eql(201);
    expect(response.body.results.length).to.eql(5);
  });

  it('should have correct data structure and format', async function() {
    const params = {
      question_id: 123,
      page: 1,
      count: 5,
    };
    const response = await request.get('/qa/questions/'+params.question_id+'/answers').query(params);
    expect(response.status).to.eql(201);
    expect(response.body.results[0].photos.length).to.equal(0);
  });
});


describe('POST /qa/questions', function() {
  it('should response with 201', async function() {
    const body = {
      body: 'YOOOOO WASSUP',
      name: 'Miw :)',
      email: 'bofa@gmail.com',
      product_id: '1234',
    };
    const response = await request.post('/qa/questions').send(body);
    expect(response.status).to.eql(201);
  });
});

describe('POST /qa/questions/:question_id/answers', function() {
  it('should response with 201', async function() {
    const body = {
      body: 'YOOOOO WASSUP',
      name: 'Miw :)',
      email: 'bofa@gmail.com',
      photos: ['sdasd.com'],
      question_id: '1234',
    };
    const response = await request.post('/qa/questions/'+ body.question_id+ '/answers').send(body);
    expect(response.status).to.eql(201);
  });
});

describe('End to end test', function() {
  it('post/get questions: should create a question and increase the number of questions by 1', async function() {
    const product_id = '99999999';
    const params = {
      product_id: product_id,
      page: 1,
      count: 100000,
    };
    let response2 = await request.get('/qa/questions').query(params);
    expect(response2.status).to.eql(201);
    const len = response2.body.results.length;
    const body = {
      body: 'what is my name',
      name: 'Miw :)',
      email: 'bofa@gmail.com',
      product_id: product_id,
    };
    const response = await request.post('/qa/questions').send(body);
    expect(response.status).to.eql(201);
    response2 = await request.get('/qa/questions').query(params);
    expect(response2.status).to.eql(201);
    expect(response2.body.results.length).to.eql(len + 1);
  });


  it('post/get answer: should create an answer and increase length by 1', async function() {
    const question_id = '5830';
    const params = {
      question_id: question_id,
      page: 1,
      count: 100000,
    };
    let response2 = await request.get('/qa/questions/' + question_id + '/answers').query(params);
    expect(response2.status).to.eql(201);
    const len = response2.body.results.length;
    const body = {
      body: 'what is my name',
      name: 'Miw :)',
      email: 'bofa@gmail.com',
      question_id: question_id,
      photos: ['sd'],
    };
    const response = await request.post('/qa/questions/' + question_id + '/answers').send(body);
    expect(response.status).to.eql(201);
    response2 = await request.get('/qa/questions/' + question_id + '/answers').query(params);
    expect(response2.status).to.eql(201);
    expect(response2.body.results.length).to.eql(len + 1);
  });
});

