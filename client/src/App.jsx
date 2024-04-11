import React, { useState } from "react";
import Home from "./components/custom/Home";
import Authentication from "./components/custom/Authentication";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" ? (
        <Home changeCurrentPage={setCurrentPage} />
      ) : currentPage === "auth" ? (
        <Authentication changeCurrentPage={setCurrentPage} />
      ) : (
        <div>404</div>
      )}
    </div>
  );
};

export default App;
