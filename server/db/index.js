const {Pool} = require('pg');
require('dotenv');
const pool = new Pool({
  user: process.env.USERNAME || '',
  database: 'QnA',
  password: '',
  host: '127.0.0.1',
  port: 5432,
});

const connection = {
  pool,
  query: (...args) => {
    return pool.connect().then((client) => {
      return client.query(...args).then((res) => {
        client.release();
        return res.rows;
      });
    });
  },
};

module.exports = connection;