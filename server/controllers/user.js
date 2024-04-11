const userRouter = require("express").Router();
const User = require("../models/user");
const logger = require('../utils/logger')

userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.get('/:name', async(request, response) => {
  const user = await User.findOne({name: request.params.name})
  response.json(user)
})

userRouter.post("/", async (request, response, next) => {
  const user = new User({
    name: request.body.name,
    password: request.body.password,
  });
  try {
    const savedUser = await user.save();
    response.status(200).json(savedUser);
  } catch (error) {
    response.status(404).json({message:'User already exists'})
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
    logger.error(error);
    response.status(500).json({ error: "Internal server error" });
  }
});



module.exports = userRouter;
