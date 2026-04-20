import { Routes, Route, Link } from "react-router-dom";

import { ColorEngine } from "./ColorEngine";
import { ModalExample } from "./pages";

import "./App.scss";

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Color Engine</Link>
          <Link to="/modal">Modal</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ColorEngine />} />
          <Route path="/modal" element={<ModalExample />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
