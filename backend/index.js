const express = require('express');
const cors = require('cors');
const rootRouter = require('./routes/index');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('This backend is up!');
});

app.use('/api', rootRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});