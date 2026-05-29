---
name: figma-arrange-component-set
description: Canonical recipe for arranging a framed-control component set into the documented density × size × variant grid, generating row/column text labels, and saving the script as a repo artefact. Covers the EDGE_PAD focus-ring fix, re-run safety, name-based variant parsing, and how to adapt the template for any new component. TRIGGER when laying out a component set grid, adding labels to a component set, writing or running an arrange script, or adapting the arrange pattern to a new component. SKIP for token work, component anatomy building, and React work.
---

# Arranging a framed-control component set

Every framed-control component set ships with a dedicated arrange script saved
under `apps/harmoni-figma-plugin/scripts/`. These scripts are run once (or
re-run after adding variants) via the Figma developer console **or** via
`mcp__figma-console__figma_execute`.

Existing scripts:
- `arrange-button-component-set.js` — Button (Context/Variant/Size/State)
- `arrange-switch-component-set.js` — Switch (Context/Size/State/Interaction)

## Grid convention

| Axis | Groups (major) | Rows/cols (minor) |
|------|---------------|-------------------|
| **Rows** | Density sections: compact → comfortable → spacious → dense | Size rows within each section: md first, then xs sm lg xl |
| **Cols** | Variant or State groups | Interaction or State sub-columns |

**md first** — placing `md` at the top of each density section means the
top-left cell is always the most-used variant at the most-used size, which
also becomes the component's **default instance**.

**Dense last** — dense is the least-used density (plugin UI only); it sits at
the bottom so it is out of the way in everyday use.

## Gap constants (standard values)

```js
const GAP_INTERACTION = 8;    // between sub-columns within a group
const GAP_STATE       = 32;   // between variant/state column groups
const GAP_SIZE        = 12;   // between size rows within a density section
const GAP_DENSITY     = 64;   // between density sections
const EDGE_PAD        = 8;    // inner padding on all 4 edges of the component set
```

`EDGE_PAD` is **required**. Focus ring frames extend 4 px beyond each
component's nominal bounds. Without the pad, the first row and column sit at
`x=0, y=0` inside the component set frame, and the −4 px ring overflow is
clipped by the frame boundary. 8 px = 4 px ring + 4 px breathing room.

Apply it by shifting *all* colX and rowY values by EDGE_PAD after calculating
them, then adding `EDGE_PAD * 2` to both dimensions when resizing the set:

```js
for (const k of Object.keys(colX)) colX[k] += EDGE_PAD;
for (const k of Object.keys(rowY)) rowY[k] += EDGE_PAD;
componentSet.resize(totalW + EDGE_PAD * 2, totalH + EDGE_PAD * 2);
```

## Re-run safety

The label group must be deleted before regenerating or labels accumulate:

```js
const existing = figma.currentPage.findOne(n => n.name === "Switch Grid Labels");
if (existing) existing.remove();
```

Use a predictable name: `"<ComponentName> Grid Labels"`.

## Name-based variant parsing (preferred over variantProperties)

During a build session, the component set may have mixed variant schemas (e.g.
old `Size=small` variants alongside new `Context=compact, Size=md` variants).
`node.variantProperties` throws `"Component set for node has existing errors"`
in that state. Parse from the node name instead — it is always reliable:

```js
function parseProps(name) {
  return {
    ctx:  name.match(/Context=(\w+)/)?.[1],
    sz:   name.match(/Size=(\w+)/)?.[1],
    st:   name.match(/State=(\w+)/)?.[1],
    iact: name.match(/Interaction=(\w+)/)?.[1],
  };
}
```

Only use `variantProperties` in scripts that run on a clean, fully-built set.

## Adapting for a new component

1. Copy the closest existing script (Button or Switch) to
   `apps/harmoni-figma-plugin/scripts/arrange-<component>-component-set.js`.
2. Change the four property name constants and the four ordering arrays.
3. Update gap constants if the component has different visual weight.
4. Change the label group name to `"<ComponentName> Grid Labels"`.
5. Update the default-instance lookup to the correct top-left cell values.

The column/row measurement, EDGE_PAD, and label generation logic are identical
across all components — do not change them.

### Mapping component dimensions to Button's Variant/State axes

| Button axis | Meaning | Switch equivalent | Checkbox equivalent |
|-------------|---------|-------------------|---------------------|
| Variant | Visual intent (primary/secondary/…) | State (unchecked/checked) | State (unchecked/checked/indeterminate) |
| State | Interaction state (default/hover/…) | Interaction (default/hover/…) | Interaction (default/hover/…) |

If a component has no Variant equivalent (e.g. a single-appearance toggle),
collapse to one "group" — the major column axis just has one entry.

## Running via figma_execute

The scripts are written to be pasted into the Figma developer console, but
they work equally well via `figma_execute` with minor adaptations:

1. Replace `figma.currentPage.selection.find(…)` with a direct `getNodeByIdAsync` lookup.
2. Replace `await figma.setCurrentPageAsync(page)` where needed.
3. The `figma.viewport.scrollAndZoomIntoView` call is harmless but optional.

Keep the font-load calls (`figma.loadFontAsync`) — they are required before
any text node characters can be set, even in `figma_execute`.

## Label layout details

```
         [above - 48px]  GROUP HEADERS  (bold, centred over each group's full width)
         [above - 24px]  sub-col labels (regular, left-aligned to each column's left edge)
[left - 180px] DENSITY LABELS  (bold, vertically centred over each density section)
[left -  56px] size labels     (regular, vertically centred over each size row)
```

All label nodes are collected into a single `figma.group(nodes, page)` so they
can be selected, hidden, or deleted as one unit. Re-style font/colour
afterwards — Inter is the safe default that is always available in Figma.
