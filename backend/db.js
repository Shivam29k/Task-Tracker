const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.DB_URL;

mongoose.connect(URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
});

const Team = mongoose.model(
  "team",
  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    teamId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        lowercase: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  })
);

const Task = mongoose.model(
  "task",
  new mongoose.Schema({
    title: String,
    description: String,
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Deployed", "Deferred"],
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    priority: { type: String, enum: ["P0", "P1", "P2"] },
  })
);

const User = mongoose.model(
  "user",
  new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    team: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Team",
        default: null,
        required: false
    }],
  })
);

// comments on the task schema
const Comment = mongoose.model(
  "comment",
  new mongoose.Schema({
    text: String,
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  })
);

module.exports = { Task, Team, User};
