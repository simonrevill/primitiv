import { createContext } from "react";

import type { CarouselContextValue } from "./types";

export const CarouselContext = createContext<CarouselContextValue | null>(null);

CarouselContext.displayName = "CarouselContext";

const CarouselProvider = CarouselContext.Provider;

export { CarouselProvider };
