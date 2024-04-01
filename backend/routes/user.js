const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/", (req, res) => {
  res.send("This backend is up!");
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Signup Route
const signUpSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(6),
  firstname: z.string().max(30).min(1),
  lastname: z.string().max(30).min(1),
});

// signup payload:
// body: {
//     username: string,
//     password: string,
//     firstname: string,
//     lastname: string,
// }

router.post("/signup", async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  console.log(parsed);
  if (!parsed.success) {
    console.log(parsed.error);
    return res.status(400).json({ message: "Invalid input" });
  }

  // Check if user already exists
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: capitalizeFirstLetter(req.body.firstname),
    lastname: capitalizeFirstLetter(req.body.lastname),
    teams: [],
  }).catch((e) => {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  });

  const userId = newUser._id;
  // Generate JWT
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.status(200).json({
    message: "User created successfully",
    token: token,
  });
});

// Signin Route

// Signin Payload:
// body: {
//     username: string,
//     password: string
// }

const signInSchema = z.object({
  username: z.string().email().min(3),
  password: z.string().min(6),
});

router.post("/signin", async (req, res) => {
  const parsed = signInSchema.safeParse(req.body);
  console.log(parsed);
  if (!parsed.success) {
    console.log(parsed.error);
    return res.status(400).json({ message: "Invalid input" });
  }

  // Check if user exists
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  // Check if password is correct
  if (user.password !== req.body.password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const userId = user._id;
  // Generate JWT
  const token = jwt.sign({ userId }, JWT_SECRET);

  res.status(200).json({
    message: "User signed in successfully",
    token: token,
  });
});

// /user route
router.get("/user", authMiddleware, async (req, res) => {
  // get user deatails from the database using the userId
  console.log(req.userId);
  const user = await User.findById(req.userId).catch((e) => {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  } else {
    res.status(200).json({ user });
  }
});

// find all the users of the same teamId
// route = /user/all-team

router.get("/all-team", authMiddleware, async (req, res) => {
  const users = await User.find({ team: req.query.teamId }).catch((e) => {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  });

  res.status(200).json({ users });
});


module.exports = router;
