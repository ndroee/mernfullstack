const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { restart } = require("nodemon");

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "no users found" });
  }
  res.json(users);
});
// @desc Create new user
// @route POST /users
// @access Private

const createNewUsers = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "all fields are required" });
  }

  // Check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "duplicate username" });
  }

  //hash password
  const hashedPwd = await bcrypt.hash(password, 10); //salt rounds

  const userObject = { username, password: hashedPwd, roles };

  //create and store new user
  const user = await User.create(userObject);
  if (user) {
    //created
    res.status(201).json({ message: `new user ${username} created` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});
// @desc Update new user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  //confirm data

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  //check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  //allow update to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (pasword) {
    //hash password
    user.password = await bcrypt.hash(password, 10); //salt rounds
  }
  const updatedUser = await User.save();

  res.json({ message: `${updatedUser.username} updated` });
});
// @desc Delete user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user id required" });
  }
  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    return res.status(400).json({ message: "user has assigned notes" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const result = await user.deleteOne();

  const reply = `username${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = { getAllUsers, createNewUsers, updateUser, deleteUser };
