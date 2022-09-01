
import "./App.css";
import { Route, Routes } from "@solidjs/router";
import Main from "./pages/main/Main";
import Setting from "./pages/Lock";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={Welcome} />
      <Route path="/lock" element={Setting} />
      <Route path="/main" element={Main}></Route>
    </Routes>
  );
}

export default App;
