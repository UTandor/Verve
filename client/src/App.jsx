import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" ? (
        <Home changeCurrentPage={setCurrentPage} />
      ) : currentPage === "login" ? (
        <Login changeCurrentPage={setCurrentPage} />
      ) : currentPage === "register" ? (
        <Register changeCurrentPage={setCurrentPage} />
      ) : (
        <div>404 </div>
      )}
    </div>
  );
};

export default App;

const Home = ({ changeCurrentPage }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("name")) {
      changeCurrentPage("login");
    }
  }, []);

  return (
    <div>
      <h1>This is the home page</h1>
      <p>house page lol</p>
      <button
        onClick={() => {
          localStorage.removeItem("name");
          changeCurrentPage("login");
        }}
      >
        logout
      </button>

      <div>
        <RecipeCreation recipes={recipes} changeRecipes={setRecipes} />
        <RecipeViewer recipes={recipes} changeRecipes={setRecipes} />
      </div>
    </div>
  );
};

const Login = ({ changeCurrentPage }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/users/login", {
        name: name,
        password: password,
      })
      .then((result) => {
        localStorage.setItem("name", name);
        setPassword("");
        setName("");
        changeCurrentPage("home");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setStatus("Incorrect name or password");
        }
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => handleLogin(e)}>
        <label htmlFor="name">Name</label>
        <input
          autoComplete="off"
          value={name}
          id="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete="off"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      <div>{status}</div>

      <div>
        <h3>Dont have an account?</h3>
        <p onClick={() => changeCurrentPage("register")}>Register</p>
      </div>
    </div>
  );
};

const Register = ({ changeCurrentPage }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const userToSave = {
      name: name,
      password: password,
    };
    axios
      .post("http://localhost:3001/api/users", userToSave)
      .then((result) => {
        localStorage.setItem("name", name);
        setPassword("");
        setName("");
        changeCurrentPage("home");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          setStatus("name already exists");
        }
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={(e) => handleRegister(e)}>
        <label htmlFor="name">Name</label>
        <input
          autoComplete="off"
          value={name}
          id="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete="off"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>
      <div>{status}</div>
      <div>
        <h3>Already have an account?</h3>
        <p onClick={() => changeCurrentPage("login")}>Login</p>
      </div>
    </div>
  );
};

const RecipeCreation = ({ recipes, changeRecipes }) => {
  const [recipe, setRecipe] = useState({
    author: localStorage.getItem("name"),
    likes: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/api/recipes", recipe).then((response) => {
      changeRecipes([...recipes, response.data]);
    });
    setRecipe({
      title: "",
      description: "",
      likes: 0,
      author: localStorage.getItem("name"),
    });
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            value={recipe.description}
            id="description"
            onChange={(e) =>
              setRecipe({ ...recipe, description: e.target.value })
            }
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const RecipeViewer = ({ recipes, changeRecipes }) => {
  const getRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/recipes");
      changeRecipes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const handleLike = async (id) => {
    await axios.put(`http://localhost:3001/api/recipes/${id}`, {
      name: localStorage.getItem("name"),
    });

    getRecipes();
  };

  return (
    <div>
      <h1>Recipe viewer here</h1>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.id}>
            <h3>{recipe.title}</h3>
            <h5>{recipe.author}</h5>
            <p>{recipe.description}</p>
            <p>Likes: {recipe.likes}</p>
            <button onClick={() => handleLike(recipe.id)}>Like</button>
          </div>
        ))
      ) : (
        <div>
          <h1>No recipes found</h1>
        </div>
      )}
    </div>
  );
};
