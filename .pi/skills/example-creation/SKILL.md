---
name: example-creation
description: How to create a new numbered example in this course repo (src/examples), including updating the examples index, numbering conventions, and the React + D3 code organization preferences. Use whenever adding, scaffolding, or refactoring an example visualization.
---

# Example Creation Skill

This skill describes how examples are structured in this repo and the house
style for organizing React + D3 code. Follow it whenever you add a new example
or refactor an existing one. **First read the
[Data Visualization Coding Style Guide](../../../docs/DATA_VISUALIZATION_CODING_STYLE.md)**;
it contains the authoritative coding conventions, including dataset loading,
accessors, `null` loading states, local hooks, and D3 rendering.

## Where examples live

- All examples live under `src/examples/`.
- Each example is its own directory named with a zero-padded 3-digit number and
  a kebab-case title: `NNN-kebab-case-title/` (e.g. `010-hovering`,
  `011-tooltips`).
- Each directory contains its needed components, render functions, hooks,
  optional config, and a `datasets.json` manifest. Examples are intentionally
  self-contained: never import source code from another numbered example. If a
  new example builds on an earlier helper such as `useDimensions` or
  `usePenguinsDataset`, copy that helper into the new example.

## Dataset manifest

- Every example has a `datasets.json` file, even when it uses no external data.
- Use `[]` when there is no external data.
- List every data file fetched by the visualization.
- Dataset paths are relative to `public/`, with no leading `/` or `public/`
  (e.g. `datasets/palmer-penguins/penguins.csv`).

## Numbering

- Examples are numbered sequentially. To create a new example, look at the
  highest existing number under `src/examples/` and **add one**. Do not reuse or
  skip numbers.
- The directory uses the padded form (`012-my-example`) while the `id` in the
  index is the plain number as a string (`'12'`).
- For example, if current highest example is `011-tooltips`, the next new example is
  `012-...`.

## Always update the index

The examples index is `src/examples/index.ts`. **Every new example must be
registered there or it will not appear in the app.** Make two edits:

1. Add an import at the top (imports are ordered by example number):
   ```ts
   import { MyExample } from './012-my-example/MyExample';
   ```
2. Add an entry to the `examples` array (same order as the imports):
   ```ts
   {
     id: '12',
     name: 'My Example',
     component: MyExample,
   },
   ```

The `examplesMap` and `defaultExample` are derived from `examples`, so no
further index changes are needed. `src/App.tsx` renders the sidebar and the
selected example from this index.

## React + D3 organization preferences

For a simple chart, start with **`020-basic-histogram`**. For
interactive, multi-layer charts, see **`010-hovering`** and
`011-tooltips` (axes, labels, and tooltip). Read the relevant example
before implementing a new one.

### SVG groups for layers; extract components where useful

- Organize visual layers as named SVG groups (marks, axes, labels, overlays).
  In simple examples, the entry component can own the groups and their
  effects, as in `020-basic-histogram`. Extract `Circles`, `Axes`,
  `Labels`, or other React layer components when that improves clarity
  or isolates interactive logic; do not require a wrapper for every group.
- When a layer has its own component, render a container group with a ref
  and a descriptive class name:
  ```tsx
  const groupRef = useRef<SVGGElement>(null);
  // ...
  return <g ref={groupRef} className="circles" />;
  ```
- React owns the SVG structure and the `<g>` elements (mounting, ordering,
  layering, className, and static transforms). D3 fills each group with marks.
- The parent (e.g. `Hovering.tsx`, `Tooltips.tsx`) composes the layers inside
  one responsive `<svg>`. Prefer the simplest organization that keeps
  the responsibilities clear.

### D3 selections for marks, JSX for static content

- **Rendering dynamic visual marks: use D3 selections** in a dedicated
  `render*.ts` function called from a `useEffect`. This is the default for
  anything data-driven or state-driven — circles, rects, paths, axes, Voronoi
  cells, etc.
- The standard pattern is:
  - An entry component or `Component.tsx` owns a group `useRef` and calls the
    render helper from `useEffect`, listing its changing inputs as dependencies.
  - `renderMarks.ts`, `renderBars.ts`, `renderCircles.ts`, etc. takes the
    D3 `selection` and an options object and performs the data join:
    ```ts
    export function renderCircles(
      selection: Selection<SVGGElement, unknown, null, undefined>,
      options: RenderCirclesOptions,
    ) {
      const { data, xScale, yScale, xValue, yValue } = options;
      selection
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', (d) => xScale(xValue(d)))
        .attr('cy', (d) => yScale(yValue(d)))
        // ...
    }
    ```
  - Export shared types/interfaces (e.g. `CircleDataPoint`,
    `RenderCirclesOptions`) from the render file and import them in the
    component.
- **Rendering static, non-dynamic content: use JSX directly.** If there is
  nothing dynamic about it, plain JSX inside the `<g>` is preferred over a D3
  selection. Text overlays are the canonical case — see
  `011-tooltips/Labels.tsx`, which renders the title and axis labels as JSX
  `<text>` elements. Do not spin up a D3 data join just to draw fixed text.
- Rule of thumb: if D3 is only being used to fill in fixed attributes with no
  data join or per-datum variation, render it with JSX instead. Axes are a
  legitimate D3 case because `d3-axis` generates many ticks dynamically.

### Responsive layout

- **Always put `ResizeObserver` in a dedicated local `useDimensions.ts`
  hook** when measuring a container; never inline the resize effect in the
  chart component. Copy the established hook into the example directory
  (for example from `019-single-histogram`).
- Set up the container as `<div ref={divRef} className="relative w-full h-full">`
  and the `<svg className="absolute inset-0 w-full h-full">`.
- Guard rendering until dimensions are non-zero and scales exist.
- Derive scales from data and dimensions with `useMemo` / a `useScales` hook so
  they are not rebuilt on unrelated state changes.

### Other conventions

- Keep tweakable values (margins, titles, axis labels, font sizes, tick counts,
  bin gaps) in named constants near the top of the component. Use `config.ts`
  when several files share substantial configuration, not as a requirement
  for a handful of constants.
- The dataset hook must preserve all source rows and columns; define named
  accessors (e.g. `xValue`, `yValue`, `binValue`) for fields used in
  visual encodings, filters, or bins.
- Represent missing/not-yet-loaded dataset values with `null`, distinct
  from a loaded empty array. Guard `null` before deriving scales or marks;
  don't hide loading with `?? 0` or placeholder data.
- Use `useMemo` to derive filtered/processed data rather than recomputing it
  inline every render; call filtered subsets `filteredData` and leave
  the source `data` intact.
- Keep a single piece of interaction state (e.g. `hoveredIndex`) in the parent;
  overlays set it and layers derive their appearance from it.
- Memoize comment-worthy logic, but prefer clear, short comments explaining
  intent over narrating the code.
- Add `role="img"` and an `aria-label` to the top-level `<svg>`.
- Use named exports for example entry components (e.g. `export function Hovering`).

## Checklist for a new example

0. Read the [coding style guide](../../../docs/DATA_VISUALIZATION_CODING_STYLE.md).
1. Create the example directory using the next number (`highest + 1`, 3-digit
   padded).
2. Copy required reusable helpers locally, including `useDimensions.ts`
   when observing container size.
3. Do not import another numbered example.
4. Create `datasets.json`.
5. Register the example in `src/examples/index.ts`.
6. Run `npm run validate:examples`.
7. Run lint, build, and Prettier.
8. Verify the example visually.
