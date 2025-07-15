import React from "react";
import LandingPage from "./Component/LandingPage";
import MenuList from "./Component/MenuList";

const App = () => {
  return (
    <main className="flex-1 select-none bg-orange-950">
      <LandingPage />
      <MenuList />
    </main>
  );
};

export default App;
