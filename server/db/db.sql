DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

CREATE TABLE questions (
  id SERIAL UNIQUE PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body CHARACTER VARYING(1000),
  date_written BIGINT NOT NULL,
  asker_name CHARACTER VARYING(60) NOT NULL,
  asker_email TEXT NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpful INTEGER NOT NULL DEFAULT 0
  );

\COPY questions FROM '../data/questions.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE questions
ALTER COLUMN date_written
SET DATA TYPE timestamptz USING timestamptz 'epoch' + date_written * interval '1 millisecond';
CREATE INDEX idx_questions_product_id
ON questions(product_id);

CREATE TABLE answers (
  id SERIAL UNIQUE PRIMARY KEY,
  question_id INTEGER,
  body CHARACTER VARYING(1000) NOT NULL,
  date_written BIGINT,
  answerer CHARACTER VARYING(60) NOT NULL,
  email TEXT NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  CONSTRAINT fk_questions
  FOREIGN KEY(question_id)
  REFERENCES questions(id)
  );

\COPY answers FROM '../data/answers.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE answers
ALTER COLUMN date_written
SET DATA TYPE timestamptz USING timestamptz 'epoch' + date_written * interval '1 millisecond';

  CREATE INDEX idx_answers_question_id
  ON answers(question_id);

  CREATE TABLE photos (
  id SERIAL UNIQUE PRIMARY KEY,
  answer_id INTEGER,
  CONSTRAINT fk_answers
  FOREIGN KEY(answer_id)
  REFERENCES answers(id),
  photo_url TEXT NOT NULL
  );

\COPY photos FROM '../data/answers_photos.csv' DELIMITER ',' CSV HEADER;

  CREATE INDEX idx_photos_answer_id
  ON photos(answer_id);

  CREATE INDEX idx_photos_id
  ON photos(id);

  CREATE INDEX idx_photos_url
  ON photos(photo_url);
