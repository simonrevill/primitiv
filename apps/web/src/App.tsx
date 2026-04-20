import { Routes, Route, Link } from "react-router-dom";

import { ColorEngine } from "./ColorEngine";
import { ModalExample, DropdownExample } from "./pages";

import "./App.scss";

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Color Engine</Link>
          <Link to="/modal">Modal</Link>
          <Link to="/dropdown">Dropdown</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ColorEngine />} />
          <Route path="/modal" element={<ModalExample />} />
          <Route path="/dropdown" element={<DropdownExample />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
