const express = require('express');
const cors = require('cors');
const rootRouter = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('This backend is up!');
});

app.use('/api', rootRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});