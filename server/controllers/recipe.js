const recipeRouter = require("express").Router();
const User = require("../models/user");
const Recipe = require("../models/recipe");

recipeRouter.get("/api/recipes", async (request, response) => {
  const recipes = await Recipe.find({});
  response.json(recipes);
});

recipeRouter.post("/api/recipes", async (request, response) => {
  const recipeToCreate = request.body;
  try {
    if (
      recipeToCreate.title &&
      recipeToCreate.description &&
      recipeToCreate.author
    ) {
      const recipeToSave = new Recipe(request.body);
      await recipeToSave.save();
      response.status(201).json(recipeToSave);
    } else {
      response.status(400).end();
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

recipeRouter.put("/api/recipes/:id", async (request, response) => {
  try {
    const recipe = await Recipe.findById(request.params.id);
    const currentUser = await User.findOne({ name: request.body.name });

    if (currentUser.liked.includes(request.params.id)) {
      recipe.likes -= 1;
      await recipe.save();
      currentUser.liked = currentUser.liked.filter(
        (id) => id !== request.params.id
      );
      await currentUser.save();

      response.status(200).json({ message: "User has unliked the post" });
    } else {
      recipe.likes += 1;
      await recipe.save();

      currentUser.liked.push(recipe.id);
      await currentUser.save();

      response.status(204).json({ message: "User has liked the post" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});

module.exports = recipeRouter;
