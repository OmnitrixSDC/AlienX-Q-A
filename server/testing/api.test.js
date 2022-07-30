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
    expect(response.status).to.eql(200);
    expect(response.body.results.length).to.eql(5);
  });

  it('returns length of 0 and success', async function() {
    const params = {
      product_id: 32423,
      page: 0,
      count: 0,
    };
    const response = await request.get('/qa/questions').query(params);
    expect(response.status).to.eql(200);
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

