import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  HeartIcon,
  TextIcon,
  ArrowUpRight,
  Grape,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Home = ({ changeCurrentPage }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("name")) {
      changeCurrentPage("auth");
    }
  }, []);

  return (
    <>
      <div className="w-full flex justify-between py-4 px-8 absolute">
        <div className="flex items-center hover:cursor-pointer space-x-1">
          <Grape size={30} strokeWidth={0.75} />
          <p className="text-2xl font-mono ">Verve</p>
        </div>
        <div>
          <Button
            onClick={() => {
              localStorage.removeItem("name");
              changeCurrentPage("auth");
            }}
            className="flex items-center space-x-2"
          >
            <p>Logout</p> <ExternalLink size={16} />
          </Button>
        </div>
      </div>
      <div className="h-screen flex flex-col space-y-8 py-32 ">
        <div className="h-[50%] w-full  justify-center flex items-center flex-col">
          <div className="space-y-6 w-1/2 text-center  items-center justify-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold">Cook. Share. Refine.</h1>
              <p className="text-xs text-slate-700 mb-2">
                Create and share recipes with each other on the web yes and no
              </p>
            </div>
            <div className=" space-y-4 flex justify-center flex-col items-center">
              <RecipeCreation recipes={recipes} changeRecipes={setRecipes} />

              <div className="flex space-x-2 justify-center items-center ">
                <Badge variant={"secondary"}>
                  UserGenerated <ArrowUpRight size={16} />
                </Badge>
                <Badge variant={"secondary"}>
                  American
                  <ArrowUpRight size={16} />
                </Badge>
                <Badge variant={"secondary"}>
                  Italian
                  <ArrowUpRight size={16} />
                </Badge>
                <Badge variant={"secondary"}>
                  Featured
                  <ArrowUpRight size={16} />
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <RecipeViewer recipes={recipes} changeRecipes={setRecipes} />
      </div>
    </>
  );
};

export default Home;

const RecipeCreation = ({ recipes, changeRecipes }) => {
  const URL = JSON.stringify(import.meta.env.BACKEND_URL);

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    author: "",
    likes: 0,
    imageUrl: "",
  });

  const triggerRef = useRef(null);

  const handleDialogTrigger = (e) => {
    e.preventDefault();
    triggerRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomFoodImage = await axios.get("https://foodish-api.com/api/");
    console.log(randomFoodImage);
    const image = randomFoodImage.data.image;
    const newRecipe = { ...recipe, imageUrl: image };
    setRecipe(newRecipe);
    axios
      .post(
        `https://verve-back.netlify.app/.netlify/functions/app//api/recipes`,
        newRecipe
      )
      .then((response) => {
        changeRecipes([...recipes, response.data]);
      });
    setRecipe({
      title: "",
      description: "",
      likes: 0,
      author: localStorage.getItem("name"),
      imageUrl: "",
    });
    handleDialogTrigger(e);
    toast("Recipe created successfully");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRecipe({ ...recipe, author: localStorage.getItem("name") });
      handleDialogTrigger(event);
    }
  };

  return (
    <div className="w-full">
      <form className="w-1/2 mx-auto" onSubmit={(e) => handleDialogTrigger(e)}>
        <Input
          type="text"
          className="pb-2 "
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          onKeyPress={handleKeyPress}
          placeholder="Create a new recipe..."
        />
      </form>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden" ref={triggerRef}>
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1/2]">
          <DialogHeader>
            <DialogTitle>Create Recipe</DialogTitle>
            <DialogDescription>
              Create a recipe by filling the form. Click create when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue={recipe.title}
                onChange={(e) =>
                  setRecipe({ ...recipe, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input
                id="author"
                defaultValue={localStorage.getItem("name")}
                disabled
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter the description here..."
                className="col-span-3"
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end w-full">
              <Button type="submit" className="w-1/2">
                Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RecipeViewer = ({ recipes, changeRecipes }) => {
  const [likedByUser, setLikedByUser] = useState([]);
  const getRecipes = async () => {
    try {
      const response = await axios.get(
        `https://verve-back.netlify.app/.netlify/functions/app//api/recipes"`
      );
      changeRecipes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLikedByUser = async () => {
    try {
      const response = await axios.get(
        `https://verve-back.netlify.app/.netlify/functions/app//api/users/${localStorage.getItem(
          "name"
        )}`
      );
      setLikedByUser(response.data.liked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipes();
    getLikedByUser();
  }, []);
  useEffect(() => {
    console.log(likedByUser);
  }, [likedByUser]);

  const handleLike = async (id) => {
    await axios.put(
      `https://verve-back.netlify.app/.netlify/functions/app//api/recipes/${id}`,
      {
        name: localStorage.getItem("name"),
      }
    );

    getLikedByUser();
    getRecipes();
  };

  return (
    <div className="px-[20%] space-y-8 pb-20">
      <h1 className="font-semibold text-3xl text-left">Explore</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3 ">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Card className="w-full max-w-sm" key={recipe.id}>
              <div className="p-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <TextIcon className="w-5 h-5" />
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    alt="Cover image"
                    height={225}
                    src={recipe.imageUrl}
                    style={{
                      aspectRatio: "400/225",
                      objectFit: "cover",
                    }}
                    width={400}
                  />
                </div>
                <div className="grid gap-1.5">
                  <h2 className="text-lg font-bold leading-none">
                    {recipe.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By
                    <span className="font-medium"> {recipe.author}</span>
                  </p>
                  <p className="text-sm leading-relaxed">
                    {recipe.description.length < 40 ? (
                      recipe.description
                    ) : (
                      <>
                        <div className="flex">
                          {recipe.description.substring(0, 35)}...
                        </div>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex w-full justify-between ">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleLike(recipe.id)}
                      variant="outline"
                      className={
                        "text-red-500 border-red-300 hover:text-red-600"
                      }
                    >
                      <HeartIcon
                        fill={likedByUser.includes(recipe.id) ? "red" : "none"}
                      />
                    </Button>
                  </div>
                  <div className="items-center my-auto">
                    Likes: {recipe.likes}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div>
            <h1>No recipes found</h1>
          </div>
        )}
      </div>
    </div>
  );
};
