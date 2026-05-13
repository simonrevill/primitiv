import { Routes, Route, Link } from "react-router-dom";

import { ColorEngine } from "./ColorEngine";
import {
  AccordionExample,
  CarouselExample,
  CollapsibleExample,
  DropdownExample,
  ModalExample,
  ToggleExample,
  ToggleGroupExample,
  TooltipExample,
} from "./pages";

import "./App.scss";

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Color Engine</Link>
          <Link to="/accordion">Accordion</Link>
          <Link to="/carousel">Carousel</Link>
          <Link to="/collapsible">Collapsible</Link>
          <Link to="/dropdown">Dropdown</Link>
          <Link to="/modal">Modal</Link>
          <Link to="/toggle">Toggle</Link>
          <Link to="/toggle-group">Toggle Group</Link>
          <Link to="/tooltip">Tooltip</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ColorEngine />} />
          <Route path="/accordion" element={<AccordionExample />} />
          <Route path="/carousel" element={<CarouselExample />} />
          <Route path="/collapsible" element={<CollapsibleExample />} />
          <Route path="/dropdown" element={<DropdownExample />} />
          <Route path="/modal" element={<ModalExample />} />
          <Route path="/toggle" element={<ToggleExample />} />
          <Route path="/toggle-group" element={<ToggleGroupExample />} />
          <Route path="/tooltip" element={<TooltipExample />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
