const db = require('../db');

db.query('SELECT NOW() as now').then(res => console.log(res.rows[0])).catch(e => console.error(e.stack))