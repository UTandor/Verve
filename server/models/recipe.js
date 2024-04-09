const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  author: String,
  likes: { type: Number, default: 0 },
  description: String,
});


recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
