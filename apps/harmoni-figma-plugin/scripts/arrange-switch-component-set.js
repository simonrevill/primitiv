/**
 * arrange-switch-component-set.js
 *
 * Positions all variants in the Switch component set into the documented grid
 * and adds text labels. Mirrors the structure of arrange-button-component-set.js.
 *
 * Grid structure:
 *   Rows    → Context section (compact / comfortable / spacious / dense)
 *               × Size row (md first, then xs sm lg xl)
 *   Columns → State group (unchecked / checked)
 *               × Interaction (default / hover / focus / disabled)
 *
 * md is placed first in each context section, and compact is the first context
 * section, so compact + md + unchecked + default lands at the top-left. That
 * component is also moved to index 0 of the set's children so Figma uses it
 * as the default instance.
 *
 * Property names and values are lowercase and match the live set exactly:
 *   Context     = compact | comfortable | spacious | dense
 *   Size        = md | xs | sm | lg | xl
 *   State       = unchecked | checked
 *   Interaction = default | hover | focus | disabled
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *  1. Select the Switch component set on the canvas.
 *  2. Open the developer console: Plugins → Development → Open console (⌘⌥I).
 *  3. Click in the console input, type  allow pasting  and press Enter.
 *  4. Paste this script and press Enter.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(async function () {

  // ─── Font loading ─────────────────────────────────────────────────────────
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // ─── Property names ───────────────────────────────────────────────────────
  const PROP = {
    density:     "Context",
    size:        "Size",
    state:       "State",
    interaction: "Interaction",
  };

  // ─── Value ordering ───────────────────────────────────────────────────────
  const DENSITY_ORDER     = ["compact", "comfortable", "spacious", "dense"];
  const SIZE_ORDER        = ["md", "xs", "sm", "lg", "xl"];
  const STATE_ORDER       = ["unchecked", "checked"];
  const INTERACTION_ORDER = ["default", "hover", "focus", "disabled"];

  // ─── Gaps (px) ────────────────────────────────────────────────────────────
  const GAP_INTERACTION = 8;    // between interaction columns within a state group
  const GAP_STATE       = 32;   // between state column groups
  const GAP_SIZE        = 12;   // between size rows within a density section
  const GAP_DENSITY     = 64;   // between density sections
  // Focus ring frames extend 4 px beyond each component edge. EDGE_PAD ensures
  // the first row/column never reaches the component-set frame boundary, which
  // would clip the overflow. 8 px = 4 px ring + 4 px breathing room.
  const EDGE_PAD        = 8;

  // ─── Find the component set ───────────────────────────────────────────────
  const componentSet = figma.currentPage.selection
    .find(n => n.type === "COMPONENT_SET");

  if (!componentSet) {
    console.error("Nothing selected. Select the Switch component set and re-run.");
    return;
  }

  const all = componentSet.children.filter(n => n.type === "COMPONENT");
  console.log(`Found ${all.length} components in "${componentSet.name}".`);

  // ─── Validate properties ──────────────────────────────────────────────────
  const valid = all.filter(c => {
    const p = c.variantProperties ?? {};
    return p[PROP.density] && p[PROP.size] && p[PROP.state] && p[PROP.interaction];
  });

  const invalid = all.filter(c => !valid.includes(c));
  if (invalid.length) {
    invalid.forEach(c => console.warn("  skipped:", c.name));
  }

  // ─── Measure maximum dimensions ───────────────────────────────────────────
  // colMaxWidth  keyed by "State_Interaction" — max width  across all densities and sizes
  // rowMaxHeight keyed by "Density_Size"      — max height across all states and interactions
  const colMaxWidth  = {};
  const rowMaxHeight = {};

  for (const c of valid) {
    const p   = c.variantProperties;
    const col = `${p[PROP.state]}_${p[PROP.interaction]}`;
    const row = `${p[PROP.density]}_${p[PROP.size]}`;
    colMaxWidth[col]  = Math.max(colMaxWidth[col]  ?? 0, c.width);
    rowMaxHeight[row] = Math.max(rowMaxHeight[row] ?? 0, c.height);
  }

  // ─── Calculate column x-positions ─────────────────────────────────────────
  // unchecked(4 interactions) | gap | checked(4 interactions)
  const colX = {};
  let x = 0;

  for (let si = 0; si < STATE_ORDER.length; si++) {
    if (si > 0) x += GAP_STATE;
    for (let ii = 0; ii < INTERACTION_ORDER.length; ii++) {
      if (ii > 0) x += GAP_INTERACTION;
      const col = `${STATE_ORDER[si]}_${INTERACTION_ORDER[ii]}`;
      colX[col] = x;
      x += colMaxWidth[col] ?? 0;
    }
  }

  // ─── Calculate row y-positions ────────────────────────────────────────────
  const rowY = {};
  let y = 0;

  for (let di = 0; di < DENSITY_ORDER.length; di++) {
    if (di > 0) y += GAP_DENSITY;
    for (let si = 0; si < SIZE_ORDER.length; si++) {
      if (si > 0) y += GAP_SIZE;
      const row = `${DENSITY_ORDER[di]}_${SIZE_ORDER[si]}`;
      rowY[row] = y;
      y += rowMaxHeight[row] ?? 0;
    }
  }

  // ─── Shift all positions inward by EDGE_PAD ──────────────────────────────
  for (const k of Object.keys(colX)) colX[k] += EDGE_PAD;
  for (const k of Object.keys(rowY)) rowY[k] += EDGE_PAD;

  // ─── Resize the component set frame ──────────────────────────────────────
  componentSet.resize(x + EDGE_PAD * 2, y + EDGE_PAD * 2);

  // ─── Position every component ─────────────────────────────────────────────
  let placed = 0, skipped = 0;

  for (const c of valid) {
    const p   = c.variantProperties;
    const col = `${p[PROP.state]}_${p[PROP.interaction]}`;
    const row = `${p[PROP.density]}_${p[PROP.size]}`;

    if (colX[col] !== undefined && rowY[row] !== undefined) {
      c.x = colX[col];
      c.y = rowY[row];
      placed++;
    } else {
      console.warn(`Could not place: ${c.name}`);
      skipped++;
    }
  }

  // ─── Make the top-left cell the default instance ──────────────────────────
  const defaultComp = valid.find(c => {
    const p = c.variantProperties;
    return p[PROP.density]     === DENSITY_ORDER[0]
        && p[PROP.size]        === SIZE_ORDER[0]
        && p[PROP.state]       === STATE_ORDER[0]
        && p[PROP.interaction] === INTERACTION_ORDER[0];
  });
  if (defaultComp) componentSet.insertChild(0, defaultComp);

  // ─── Text labels ──────────────────────────────────────────────────────────
  // Remove any pre-existing Switch Grid Labels group to allow safe re-runs.
  const existing = figma.currentPage.findOne(n => n.name === "Switch Grid Labels");
  if (existing) existing.remove();

  const ABOVE_STATES       = 48;   // px above set top: state group headers
  const ABOVE_INTERACTIONS = 24;   // px above set top: interaction sub-headers
  const LEFT_DENSITY       = 180;  // px left of set: density section labels
  const LEFT_SIZES         = 56;   // px left of set: size row labels

  const cx = componentSet.x;
  const cy = componentSet.y;
  const labelNodes = [];

  function makeLabel(text, canvasX, canvasY, bold) {
    const t      = figma.createText();
    t.fontName   = { family: "Inter", style: bold ? "Bold" : "Regular" };
    t.fontSize   = bold ? 12 : 11;
    t.characters = text;
    t.x = canvasX;
    t.y = canvasY;
    figma.currentPage.appendChild(t);
    labelNodes.push(t);
    return t;
  }

  // State group headers + interaction sub-headers (above the component set)
  for (const state of STATE_ORDER) {
    const firstCol   = `${state}_${INTERACTION_ORDER[0]}`;
    const lastCol    = `${state}_${INTERACTION_ORDER[INTERACTION_ORDER.length - 1]}`;
    const groupLeft  = colX[firstCol]  ?? 0;
    const groupRight = (colX[lastCol] ?? 0) + (colMaxWidth[lastCol] ?? 0);
    const groupCentreX = groupLeft + (groupRight - groupLeft) / 2;

    const sl = makeLabel(state.toUpperCase(), 0, cy - ABOVE_STATES, true);
    sl.x = cx + groupCentreX - sl.width / 2;

    for (const interaction of INTERACTION_ORDER) {
      const col = `${state}_${interaction}`;
      makeLabel(interaction, cx + (colX[col] ?? 0), cy - ABOVE_INTERACTIONS, false);
    }
  }

  // Density section labels + size row labels (left of the component set)
  for (const density of DENSITY_ORDER) {
    const firstRow      = `${density}_${SIZE_ORDER[0]}`;
    const lastRow       = `${density}_${SIZE_ORDER[SIZE_ORDER.length - 1]}`;
    const sectionTop    = rowY[firstRow] ?? 0;
    const sectionBottom = (rowY[lastRow] ?? 0) + (rowMaxHeight[lastRow] ?? 0);
    const sectionMidY   = sectionTop + (sectionBottom - sectionTop) / 2;

    const dl = makeLabel(density.toUpperCase(), cx - LEFT_DENSITY, 0, true);
    dl.y = cy + sectionMidY - dl.height / 2;

    for (const size of SIZE_ORDER) {
      const row     = `${density}_${size}`;
      const rowMidY = (rowY[row] ?? 0) + (rowMaxHeight[row] ?? 0) / 2;
      const sl      = makeLabel(size, cx - LEFT_SIZES, 0, false);
      sl.y          = cy + rowMidY - sl.height / 2;
    }
  }

  const labelGroup  = figma.group(labelNodes, figma.currentPage);
  labelGroup.name   = "Switch Grid Labels";
  console.log(`Created ${labelNodes.length} labels in "${labelGroup.name}".`);

  figma.viewport.scrollAndZoomIntoView([componentSet, labelGroup]);
  console.log(`Done. Placed ${placed}${skipped ? `, skipped ${skipped}` : ""}.`);
  console.log(`Component set resized to ${Math.round(x)} × ${Math.round(y)} px.`);

})().catch(err => console.error("Script error:", err.message));
