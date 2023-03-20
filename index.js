const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const dbFile = 'db.json';

app.get('/votes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  res.json(data);
});

app.post('/votes', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    
    // Merge new tweetVotes with existing tweetVotes
    const updatedTweetVotes = {
      ...data.tweetVotes,
      ...req.body.tweetVotes,
    };
  
    // Merge new teamScores with existing teamScores
    const updatedTeamScores = {
      ...data.teamScores,
      ...req.body.teamScores,
    };
  
    const newData = {
      teamScores: updatedTeamScores,
      tweetVotes: updatedTweetVotes,
    };
  
    fs.writeFileSync(dbFile, JSON.stringify(newData, null, 2));
    res.json(newData);
  });  

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
