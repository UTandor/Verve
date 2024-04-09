const userRouter = require("express").Router();
const User = require("../models/user");



userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post("/", async (request, response, next) => {
  const user = new User({
    name: request.body.name,
    password: request.body.password,
  });
  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (request, response) => {
  try {
    const foundUser = await User.find({
      name: request.body.name,
      password: request.body.password,
    });

    if (foundUser.length === 1) {
      response.status(200).json(foundUser);
    } else {
      response.status(403).json({ error: "Incorrect username or password" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = userRouter;
