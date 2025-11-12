import { Router } from "express";
import { UserModel } from "../models/UserModel.js";
import { compare } from "bcryptjs";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { config } from "dotenv";
import { verifyToken } from "../middlewares/verifyToken.js";

config();
export const userRouter = Router();

//Create User
userRouter.post("/user", async (req, res) => {
  let newUser = req.body;

  let newUD = new UserModel(newUser);

  let newUserDoc = await newUD.save();
  console.log("New user doc:", newUserDoc);
  if (!newUserDoc) {
    throw new Error("Error in creating new User");
  } else {
    res.status(201).json({ message: "New User created" });
  }
});

//Authenticate User
userRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  let userObj = await UserModel.findOne({ email: email });
  if (userObj === null) {
    res.status(401).json({ message: "Invalid Email" });
  } else {
    let result = await compare(password, userObj.password);
    if (result === false) {
      res.status(401).json({ message: "Invalid Password" });
    } else {
      let { password, ...userWithoutPassword } = userObj.toObject();
      const signedToken = sign({ user: userWithoutPassword }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", signedToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 1000,
      });
      res.status(200).json({ success: true, payload: userWithoutPassword });
    }
  }
});

//Logout User
userRouter.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 2 * 60 * 1000,
  });
  //res
  res.status(200).json({ message: "Logout success" });
});

userRouter.get("/test", verifyToken, (req, res) => {
  res.json({ message: "protected" });
});

//add to-do
userRouter.post("/todo/:userId", async (req, res) => {
  let newTodo = req.body;
  console.log("new todo ", newTodo);
  let userObj = await UserModel.findByIdAndUpdate(
    req.params.userId,
    { $addToSet: { todos: newTodo } },
    { new: true }
  );
  res.json({ success: true, payload: userObj });
});

//update task
userRouter.put("/edit-todo", async (req, res) => {
  let updatedTodo = req.body;

  let { userId, taskId } = req.query;


 // const { _id, ...rest } = updatedTodo; // remove _id
  let userObj = await UserModel.findOneAndUpdate(
    { _id: userId, "todos._id": taskId },
    {
      $set: {
        "todos.$.taskName": updatedTodo.taskName,
        "todos.$.description": updatedTodo.description,
      },
    },
    { new: true }
  );

  res.json({ success: true, payload: userObj });
});

//update to-do by change status to completed
userRouter.put("/todo", async (req, res) => {
  let updatedTodo = req.body;

  let { userId, taskId } = req.query;

  let userObj = await UserModel.findOneAndUpdate(
    { _id: userId, "todos._id": taskId },
    {
      $set: {
        "todos.$.taskName": updatedTodo.taskName,
        "todos.$.description": updatedTodo.description,
        "todos.$.status": updatedTodo.status,
      },
    },
    { new: true }
  );

  res.json({ success: true, payload: userObj });
});

//delete to-do
userRouter.put("/delete-todo", async (req, res) => {
  let { userId, taskId } = req.query;

  let userObj = await UserModel.findOneAndUpdate(
    { _id: userId },
    { $pull: { todos: { _id: taskId } } },
    { new: true }
  );

  res.json({ success: true, payload: userObj });
});
