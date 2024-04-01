const express = require('express');
const z = require('zod');
const { authMiddleware } = require('../middleware');
const { Task } = require('../db');

const router = express.Router();

// Create Task
const createTaskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    teamId: z.string().min(1).max(100),
    priority: z.string().min(2).max(2),
    assigneeId: z.string().min(1).max(100),
});

router.post('/create', authMiddleware, async (req, res) => {
    const validInputs = createTaskSchema.safeParse(req.body);
    console.log(validInputs);
    if (!validInputs.success) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        teamId: req.body.teamId,
        status: 'Pending',
        assignee: req.body.assigneeId,
        priority: req.body.priority,
        startDate: new Date(),
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
// route = /task/all-user

router.get('/all-user', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ assignee: req.userId }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });
    return res.status(200).json({ tasks });
});

// get the list of all the tasks in a team
// route = /task/all-team
router.get('/all-team', authMiddleware, async (req, res) => {
    const tasks = await Task.find({
        teamId: req.body.teamId,
    }).catch((e) => {
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
    const validInputs = updateTaskSchema.safeParse(req.body);
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