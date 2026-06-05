window.VARIANTS = {
  projectName: "Primitiv / Harmoni",
  brandName: "Primitiv",
  concepts: [
    {
      name: "★ Pairing — locked Primitiv + Harmoni candidates",
      variants: [
        {
          id: "P",
          name: "Primitiv (locked)",
          description: "Diagonal golden ×3 (flip), gap 0.0375. The decided Primitiv mark.",
          light: "c1-golden3-flip-gap3.svg"
        },
        {
          id: "H-bold",
          name: "Harmoni — Ring (bold outer)",
          description: "Outer frame 1.0→0.55, gap 5.06 (== Primitiv), small inner core ≤0.325. Heaviest outer frame; reads closest to Primitiv's mass.",
          light: "harmoni-ring-bold.svg"
        },
        {
          id: "H-balanced",
          name: "Harmoni — Ring (balanced)",
          description: "Outer frame 1.0→0.775 (thickness == gap), gap 5.06, inner ≤0.55. Frame and gap equal width — most even, 'target'-like.",
          light: "harmoni-ring-balanced.svg"
        },
        {
          id: "H-thin",
          name: "Harmoni — Ring (thin outer)",
          description: "Thin outer outline 1.0→0.925, gap 5.06, large inner ≤0.70. Inner triangle dominates; outer reads as a hairline frame.",
          light: "harmoni-ring-thin.svg"
        }
      ]
    },
    {
      name: "A · Subdivision",
      variants: [
        {
          id: "A1",
          name: "Primitiv — Medial",
          description: "Equilateral triangle (the geometric primitive) with the midpoint triangle removed. The base form plus its first recursive subdivision.",
          light: "primitiv-subdivision.svg"
        },
        {
          id: "A2",
          name: "Harmoni — Ramp",
          description: "The same triangle cut into three bands at the trisection heights. A tonal ramp / proportional scale — palette harmony.",
          light: "harmoni-ramp.svg"
        }
      ]
    },
    {
      name: "B · Nested proportion",
      variants: [
        {
          id: "B1",
          name: "Primitiv — Ring",
          description: "Outer triangle minus a concentric triangle scaled 0.5 about the centroid: a clean triangular ring. The primitive as a container.",
          light: "primitiv-nested.svg"
        },
        {
          id: "B2",
          name: "Harmoni — Series",
          description: "Concentric triangles (1.0 / 0.74 / 0.52 / 0.30 / 0.10) forming outer ring + inner ring + core. A series of proportional steps.",
          light: "harmoni-nested.svg"
        }
      ]
    },
    {
      name: "C · Asymmetric Harmoni (tuned)",
      variants: [
        {
          id: "C-g3",
          name: "Diagonal — golden ×3",
          description: "Three bands parallel to the left edge, thicknesses in golden ratio (1 : φ : φ²), diminishing to the bottom-right corner. Strong, minimal.",
          light: "c1-golden3.svg"
        },
        {
          id: "C-g4",
          name: "Diagonal — golden ×4",
          description: "Four golden-ratio bands. The clearest 'generative scale' — reads as a tonal series while staying crisp at favicon size. Recommended.",
          light: "c1-golden4.svg"
        },
        {
          id: "C-g3f",
          name: "Diagonal — golden ×3 (flip)",
          description: "Golden ×3 leaning the other way: small steps ascending left-to-right into a heavy mass at bottom-right. Feels expansive / growing.",
          light: "c1-golden3-flip.svg"
        },
        {
          id: "C-g3f+",
          name: "Diagonal — golden ×3 (flip, gap 0.025)",
          description: "Flip with gaps 0.018 → 0.025: a touch more separation between the steps.",
          light: "c1-golden3-flip-gap.svg"
        },
        {
          id: "C-g3f++",
          name: "Diagonal — golden ×3 (flip, gap 0.0285)",
          description: "Subtle reading of 'half as much again' — the previous +0.007 bump grown by half (0.025 → 0.0285).",
          light: "c1-golden3-flip-gap2.svg"
        },
        {
          id: "C-g3f+++",
          name: "Diagonal — golden ×3 (flip, gap 0.0375)",
          description: "Larger reading — 1.5× the 0.025 gap. Clearly more open shards.",
          light: "c1-golden3-flip-gap3.svg"
        },
        {
          id: "C-e4",
          name: "Diagonal — equal ×4",
          description: "Four equal bands, for comparison. More mechanical / uniform than the golden progression.",
          light: "c1-equal4.svg"
        }
      ]
    }
  ]
};
