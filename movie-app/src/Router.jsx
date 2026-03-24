import { Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default Router;