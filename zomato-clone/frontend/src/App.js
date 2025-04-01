import React from "react";
import RestaurantView from "./components/3DRestaurantView";
import "./index.css";

function App() {
  return (
    <div className="app bg-gray-100">
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-orange-600">Zomato 3D Viewer</h1>
      </header>
      <main>
        <RestaurantView />
      </main>
    </div>
  );
}

export default App;
