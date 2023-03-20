const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

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

app.put('/lock/:tweetId', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

  const { tweetId } = req.params;
  const { locked } = req.body;

  if (data.tweetVotes[tweetId]) {
    data.tweetVotes[tweetId].locked = locked;
  } else {
    data.tweetVotes[tweetId] = { locked };
  }

  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

  res.status(200).json({ message: "Locked state updated" });
});

app.put('/comment/:tweetId', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));

  const { tweetId } = req.params;
  const { comment } = req.body;

  if (data.tweetVotes[tweetId]) {
    data.tweetVotes[tweetId].comment = comment;
  } else {
    data.tweetVotes[tweetId] = { comment };
  }

  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

  res.status(200).json({ message: "Comment updated" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
