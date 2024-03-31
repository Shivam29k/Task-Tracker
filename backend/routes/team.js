const express = require('express');
const { authMiddleware } = require('../middleware');
const { Team, User } = require('../db');
const z = require('zod');

const router = express.Router();

// Create Team
const createTeamSchema = z.object({
    name: z.string().min(1).max(100),
    teamId: z.string().min(1).max(50)
});

router.post('/create', authMiddleware, async (req, res) => {
    console.log(req.body);
    const validInputs = createTeamSchema.parse(req.body);
    if (!validInputs) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // check if the teamId already exists
    const team = await Team.findOne({ teamId: req.body.teamId });
    if (team) {
        return res.status(400).json({ message: 'Team Id already exists' });
    }
    console.log(req.userId);

    // Create new team
    const newTeam = await Team.create({
        name: req.body.name,
        teamId: req.body.teamId,
        members: [req.userId],
    }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }).then((team) => {
        console.log(team);
        User.findOneAndUpdate({ _id: req.userId }, { $push: { team: team._id } })
        .catch((e) => {
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        });
    });



    res.status(200).json({
        message: 'Team created successfully',
        team: newTeam,
    });
});


// Add member to team
const addMemberSchema = z.object({
    teamId: z.string().min(1).max(50),
    memberId: z.string().min(1).max(50),
}); 

router.post('/add-member', authMiddleware, async (req, res) => {
    const validInputs = addMemberSchema.parse({
        teamId: req.body.teamId,
        memberId: req.body.memberId,
    });
    if (!validInputs) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // check if the team exists
    const team = await Team.findOne({ teamId: req.body.teamId });
    if (!team) {
        return res.status(400).json({ message: 'Team does not exist' });
    }

    // check if the user exists
    const user = await User.findOne({ _id: req.body.memberId });
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    // add member to team
    team.members.push(req.body.memberId);
    await team.save().catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });

    res.status(200).json({
        message: 'Member added successfully',
        team,
    });
});


// Get list of all the teams of a user


// Get list of all the teams of a user
// route = /team/all-team
router.get('/all-team', authMiddleware, async (req, res) => {
    const teams = await Team.find({ members: req.userId }).catch((e) => {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    });
    return res.status(200).json({ teams });
});

module.exports = router;