const express = require('express');
const app = express();
const questionRoutes = require('./routes/questions.js');
const answerRoutes = require('./routes/answers.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', questionRoutes);
app.use('/', answerRoutes);

app.get('/loaderio-deb4d23df9cbef92e42b84b710e54b52', (req, res) => res.send('loaderio-deb4d23df9cbef92e42b84b710e54b52'));
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);