const express = require('express');
const userRouter = require('./user');
const teamRouter = require('./team');
const taskRouter = require('./task');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This backend is up!');
});
router.use('/user', userRouter);
router.use('/team', teamRouter);
router.use('/task', taskRouter);

module.exports = router;