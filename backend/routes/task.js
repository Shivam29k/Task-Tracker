const express = require('express');
const z = require('zod');
const { authMiddleware } = require('../middleware');
const { Task } = require('../db');

const router = express.Router();

// Create Task
const createTaskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    team: z.string().min(1).max(100),
    assignee: z.string().min(1).max(100),
    priority: z.string().min(2).max(2),
    date: z.date(),
});

router.post('/create', authMiddleware, async (req, res) => {
    const validInputs = createTaskSchema.parse(req.body);
    if (!validInputs) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        team: req.body.team,
        status: 'Pending',
        assignee: req.userID,
        priority: req.body.priority,
        date: req.body.date,
    }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });

    res.status(200).json({
        message: 'Task created successfully',
        task,
    });
});



// get list of all the tasks assigned to an user
// route = /task/all

router.get('/all', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ assignee: req.userID }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });
    return res.status(200).json({ tasks });
});

// assine can edit the Priority and status of a task
// route = /task/update
const updateTaskSchema = z.object({
    taskId: z.string().min(1).max(100),
    priority: z.string().min(2).max(2),
    status: z.string().min(1).max(100),
});

router.post('/update', authMiddleware, async (req, res) => {
    const validInputs = updateTaskSchema.parse(req.body);
    if (!validInputs) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const task = await Task.findOne({ _id: req.body.taskId }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });

    if (!task) {
        return res.status(400).json({ message: 'Task does not exist' });
    }

    task.priority = req.body.priority;
    task.status = req.body.status;
    await task.save().catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });

    res.status(200).json({ message: 'Task updated successfully', task });
});


module.exports = router;