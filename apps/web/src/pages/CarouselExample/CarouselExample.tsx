import type { ReactNode } from "react";

import { Tabs } from "@primitiv/react";

import {
  MultiSlideScroll,
  SingleSlideCrossfade,
  SingleSlideScroll,
} from "./examples";
import "./CarouselExample.scss";

interface ExampleTab {
  value: string;
  label: string;
  render: () => ReactNode;
}

const TABS: ExampleTab[] = [
  {
    value: "single-slide-scroll",
    label: "Single · Slide",
    render: () => <SingleSlideScroll />,
  },
  {
    value: "single-slide-crossfade",
    label: "Single · Fade",
    render: () => <SingleSlideCrossfade />,
  },
  {
    value: "multi-slide-scroll",
    label: "Multi · Slide",
    render: () => <MultiSlideScroll />,
  },
];

export function CarouselExample() {
  return (
    <div className="carousel-example">
      <Tabs.Root defaultValue={TABS[0].value}>
        <Tabs.List
          className="carousel-example__tabs"
          label="Carousel examples"
        >
          {TABS.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              className="carousel-example__tab"
              value={value}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {TABS.map(({ value, render }) => (
          <Tabs.Content
            key={value}
            className="carousel-example__panel"
            value={value}
          >
            {render()}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
