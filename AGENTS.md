# Agent Instructions

This repository contains the **Constructing Visualizations** course examples,
built with React, TypeScript, SVG, and D3.

## Required guidance for visualization work

When creating or modifying a numbered example under `src/examples/`,
**read and follow both**:

1. [Data Visualization Coding Style Guide](docs/DATA_VISUALIZATION_CODING_STYLE.md)
2. [Example Creation Skill](.pi/skills/example-creation/SKILL.md)

Treat the coding style guide as the source of truth for React–D3 division of
responsibility, dataset/loading conventions, accessors, dimensions hooks,
rendering helpers, naming, and simplicity. Use the example-creation skill for
numbering, `datasets.json`, index registration, and the creation checklist.
If their recommendations appear to conflict, prefer the style guide for code
organization and update the stale guidance rather than silently diverging.

## Core conventions

- Keep each numbered example self-contained. Copy reusable hooks into that
  example; never import source from a different numbered example.
- Load and preserve the **entire dataset**: all rows and columns. Define
  named accessors for fields used in calculations or encodings, and name
  filtered subsets `filteredData`.
- Represent datasets that have **not yet loaded** with `null`, not fabricated
  empty arrays or zero-valued placeholders. Keep successfully loaded `[]`
  distinct from the loading state.
- Keep `ResizeObserver` logic in a per-example `useDimensions.ts` hook.
- React owns SVG structure and fixed labels; D3 renders data-driven marks
  inside `<g>` containers using `renderMarks`, `renderBars`, or similarly
  named helpers with typed options.
- Prefer the simplest code that conveys the visualization. Use named
  constants, direct expressions, clear names, and boundary checks instead
  of buried magic numbers or repeated defensive fallbacks.

## Verification

For new or changed examples, run `npm run validate:examples`,
`npm run lint`, `npm run build`, formatting, and a visual check when
the environment supports them. Report any checks that were not run.
