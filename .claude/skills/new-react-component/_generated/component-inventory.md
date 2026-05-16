# Component inventory

One row per component in `packages/react/src/`. Use this to find the
closest analogue to whatever you're scaffolding and mirror its shape.

| Component | Kind | Has hooks/ | Contexts | Tests | Notes |
|---|---|---|---|---|---|
| Accordion | Compound, roving tabindex | yes (Root, Item, Trigger + item & header contexts) | AccordionContext | 12 | Multi-mode (single / multiple), pre-filters disabled items, separate item context for nested heading/trigger/content. |
| Button | Simple element | no | none | 5 | Renders `<button type="button">` by default. Supports `asChild` via Slot. |
| Carousel | Compound, complex | yes (Root, Viewport, Slide + context) | CarouselContext | 23 | Scroll-snap based; IntersectionObserver for sync; loop animation, slides-per-page/move, reduced motion, translations. |
| Checkbox | Compound, controllable | yes (Root + context) | CheckboxContext | 7 | Supports indeterminate, custom indicator child. |
| Collapsible | Compound, disclosure | yes (Root, Trigger) | CollapsibleContext | 8 | Supports forceMount on Content, triggerIcon. |
| Divider | Simple element | no | none | 1 | Horizontal / vertical separator. Single test file. |
| Dropdown | Compound, very complex | yes (Root, Trigger, Content, Item, Group, Sub + 6 contexts) | Dropdown / Content / Group / ItemIndicator / RadioGroup / Sub | 17 | Menu with sub-menus, checkbox/radio items, typeahead, item indicators. Has its own `constants.ts`. |
| MillerColumns | Compound, roving tabindex | yes (Root, Column, Item + 3 contexts) | MillerColumnsContext, MillerColumnsColumnContext, MillerColumnsItemContext | 12 + fixtures | Miller columns / cascading lists. Recursive composition (no data prop); child columns portal-projected into the Root strip; single tree-wide roving tabstop; `partitionItemChildren` splits an Item's cell from its nested Column. |
| Modal | Compound, disclosure | yes (Root, Trigger, Content) | ModalContext | 14 | Uses native `<dialog>` with a polyfill (`dialog-polyfill.ts`); nested modals, click-outside, escape-hatches. |
| Portal | Simple utility | no | none | 1 | Public DOM-escape primitive wrapping `createPortal`. No state or context; consumed by Modal.Portal. |
| RadioGroup | Compound, roving tabindex | yes (Root + item context) | RadioGroupContext, RadioGroupItemContext | 11 | `orientation: "both"`, pre-filters disabled; arrow does nothing while focus is on a disabled radio. |
| Slot | Internal utility | n/a | n/a | 2 | The asChild composition primitive. Also exports `composeEventHandlers`. Used by every component that supports asChild. |
| Table | Sub-component family | no | none | 9 | Compound but stateless — Root, Header, Body, Footer, Caption, Row, Cell, Head, ScrollArea. |
| Tabs | Compound, roving tabindex | yes (Root, Trigger, Content) | TabsContext | 13 + fixtures | Activation modes (automatic / manual), lazy-mount panels, imperative API via ref, change-event-callbacks split. Has its own `utils.ts`. |

Patterns by inheritance:

- Closest to a new **roving-tabindex compound**: copy Tabs first, then look at Accordion and RadioGroup for variants on disabled-handling.
- Closest to a new **disclosure** (open/close, no roving): copy Collapsible.
- Closest to a new **portal + overlay** widget: copy Modal.
- Closest to a new **menu-like** widget: copy Dropdown — but it's the heaviest, only mirror what you actually need.
- For a **simple element** wrapper: copy Button or Divider.
- For a **sub-component family without state**: copy Table.

Total components: 14. The shared utilities they all build on are in
`shared-hooks.md` and `shared-utils.md`.
