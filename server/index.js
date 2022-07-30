const express = require('express');
const app = express();
const questionRoutes = require('./routes/questions.js');
const answerRoutes = require('./routes/answers.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', questionRoutes);
app.use('/', answerRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);