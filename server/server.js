const express = require('express'); // server shit
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./db.js'); // connectie met db
const { redirect } = require('react-router-dom');

const app = express();
let returned_user;

app.use(cors()); // allow cross orgin req
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/", function (req, res) {
  res.send('nothing to see here - connected with database');
});

app.post('/api/saveNewSurvey', bodyParser.json(), async function (req, res) {
    try {
        // starting a SQL transaction
        await runQuery('BEGIN')
        // inserting a survey and getting the inserted id back
        const surveyId = await insertAndGetLastId("INSERT INTO survey (title, description, open_date, close_date, can_be_anonymous) VALUES (?, ?, ?)",
            [req.body.title, req.body.description, req.body.openDate, req.body.closeDate, req.body.anonymity])
        // commit the started SQL transaction
        await runQuery('COMMIT');
        try {
            // starting a loop to insert every question in the database
            for (const [index, question] of req.body.questions.entries()) {

                //check in the question is an open or a multiple choice question
                if (question.type === 'Open') {
                    // starting a SQL transaction for every loop cycle
                    await runQuery('BEGIN')
                    // inserting an open question and getting the inserted id back, so you can use it in the question query
                    const openQuestionId = await insertAndGetLastId("INSERT INTO open_question (question) VALUES (?)",
                        [question.question])

                    // inserting the question with the open question id and getting the question id back
                    const questionId = await insertAndGetLastId("INSERT INTO questions (Open_Question_ID, is_deleted) VALUES (?, ?)",
                        [openQuestionId, false])

                    // insert everything in the filled_in table to combine everything
                    await runQuery("INSERT INTO filled_in (Survey_ID, Question_ID, question_order) VALUES (?, ?, ?)",
                        [surveyId, questionId, index])
                    // commit the started SQL transaction for every loop cycle
                    await runQuery('COMMIT');
                } else if (question.type === 'MultipleChoice') {

                } else {
                    console.log('wrong type of question')
                }
            }
        } catch (error) {
            // in case of an error rollback the SQL transaction
            await runQuery('ROLLBACK');
            console.log(error)
        }
    } catch (error) {
        await runQuery('ROLLBACK');
    }
    // Helper function to put a insert and a last id together
    async function insertAndGetLastId(query, param) {
        await runQuery(query, param)
        return  await getLastInsertedId()
    }
    // Helper function to get the ID of the last inserted row
    function getLastInsertedId() {
        return new Promise((resolve, reject) => {
            db.get('SELECT last_insert_rowid() as id', (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row.id);
                }
            });
        });
    }
    // Helper function to run a query with parameters
    function runQuery(sql, params) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }
    res.send('saved')
})

app.get("/test", function(req, res){
  //res.send('test'); < dit zorgde er voor dat het de hele tijd borkte. je kan maar 1x een send of json dingetje hebben.
  res.type('json');
  db.all('SELECT name FROM sqlite_schema', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* dummy test api endpoint */
app.get("/api/test_question", function (req, res) {
  res.type('json');
  db.all('Select * FROM questions', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* this endpoint is for changing questions.
We first check if it's an open or multiple choice and then update the columns around it.
for multiple choice we will also have to update the options. */
app.post('/api/questions', bodyParser.json(), function (req, res) {
  const { type, question, questionId } = req.body;
  console.log('Question type is ' + type)
  console.log('Question is ' + question)
  console.log('Question Id is ' + questionId)
  console.log('Req.body is ' + req.body)
  res.type('json');
  if (type === 'Open') {
    db.run('UPDATE open_question SET question = ? WHERE open_question_id = ?', [question, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('question_id:', questionId),
      console.log('question', question)
    )
  }
  else if (type === 'MultipleChoice') {
    db.run('UPDATE multiple_choice SET question = ? WHERE multiple_choice_id = ?', [req.body.question, req.body.questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('question_id:', questionId),
      console.log('question', question)
    )
    db.run('UPDATE option SET option = ? WHERE option_id = ?', [req.body.options, req.body.questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('')
    )
  }
});

/* GET function for fetching all questions. */
app.get("/api/questions", function (req, res) {
  res.type('json');
  db.all('Select * FROM questions', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* GET function for fetching all surveys. */
app.get("/api/surveys", function (req, res) {
  res.type('json');

  db.all('Select * FROM survey', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* GET endpoint for the user table. */
app.get('/api/users', function (req, res) {
  res.type('json');
  db.all('Select * from user', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row)
    res.send(JSON.stringify(row));
  });
});

/* GET endpoint for filled_in surveys */
app.get('/api/filled_surveys', function (req, res) {
  res.type('json');
  db.all('Select * from filled_in', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row)
    res.send(JSON.stringify(row));
  });
});

app.get("/test_birb", function(req, res){
  res.type('json');
  db.all('SELECT * FROM vogels', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    console.log(row);
    res.json(row);
  });
});

app.get("/test_games", function(req, res){
  res.type('json');
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});

app.get("/test_random", function(req, res){
  res.type('json');
  db.all('SELECT * FROM random', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});

app.get("/handle_login", function(req, res){
  res.send('post');
});

/*user = [{// temp user, moet nog users aanmaken kek
  email:"eeee@gmail.com",
  password:"eeeeeee"
}];

app.post("/handlelogin", bodyParser.json(), function(req, res, next){
  console.log(req.body.email, req.body.password); // kijken of hij login gegevens door stuurt
  const { email, password } = req.body;

  const login = (email, password) => user.some(user => user.email === email && user.password === password);
  // whack manier om te checken of doorgestuurde inlog klopt met array

  login(email, password) ?
  res.redirect('/post_login') : res.sendStatus(451); // check of inlog overeenkomt anders gooit ie status error

  //res.send('post');
});*/

app.post("/handle_login", bodyParser.json(), function(req, res, next){
  console.log(req.body.email, req.body.password); // kijken of hij login gegevens door stuurt
  const { email, password } = req.body;

  db.get('SELECT * FROM login WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err){
       console.log(err.message);
    } else if(row === undefined) {//als combi niet klopt geeft hij undefined terug
      res.status(451).json({
        message: "451 Unavailable For Legal Reasons"
      }); 
      console.log(row); //kijken of ie ook undefined teruggeeft
    } else {
      console.log(row); //geeft hij een row terug?
      console.log(typeof row); //object
      console.log(Object.entries(row)[1]); //k:v van obj
      returned_user = Object.values(row)[1]; //maar ik wil alleen de value van de ingelogde user
      console.log(returned_user); //hoe krijgen we dit in react terug
      
      req.body.user = returned_user;
      console.log(req.body);

      res.redirect("/post_login");
    }
    console.log(returned_user);
  });
});

app.get("/post_login", function(req, res){
  console.log("ingelogd") //als t goed gaat zou ik dit moeten zien in console
  res.status(200).json({
    user: returned_user
  });
  console.log(returned_user);
});

app.listen(81); // start server