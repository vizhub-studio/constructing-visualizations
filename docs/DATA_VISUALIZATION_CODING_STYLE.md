# Data Visualization Coding Style Guide

This is the house style for numbered React + D3 examples in `src/examples/`.
Read this guide and the [example-creation skill](../.pi/skills/example-creation/SKILL.md)
before adding or refactoring a visualization.

**Guiding principle: as simple as possible, but with clear responsibilities.**
Prefer a small, readable example that teaches one idea to a generic framework.
Example `020-basic-histogram` illustrates a minimal static chart,
`008-scatter-plot` demonstrates `renderMarks`, and `010-hovering` /
`011-tooltips` show when separate layer components help.

## Load the full dataset; keep it intact

- Each example owns its own `use*Dataset.ts` hook. Copy a useful hook from a
  previous numbered example rather than importing it across example directories.
- Fetch **all rows and all columns**. Do not keep only the one field currently
  being visualized, and do not throw away the rest of each CSV row.
- Define a row type for the entire dataset, including unused fields. Convert
  numeric columns in the loader according to the source data format.
- Keep the loaded `data` intact. Filter or transform it *after loading* for a
  particular visualization; do not change the shared dataset just because
  some measurements are missing.
- Use a `datasets.json` manifest for every numbered example, as required by
  the example-creation skill.

## Use `null` to signal unavailable or not-yet-loaded data

- An asynchronous dataset hook should return `Row[] | null`: start with
  `null` while loading, and set the actual rows when loading completes.
  `null` is *not* the same as a successfully loaded empty array (`[]`).
- Similarly, return `null` for derived bins or scales that cannot yet be
  computed because required data or dimensions are unavailable. Guard once
  at the boundary before computing them or rendering marks.
- Do not replace `null` with placeholder objects, artificial zero-valued
  rows, `?? []`, or `?? 0` merely to avoid handling loading states. That
  hides the distinction between *not yet available* and *real data*.
- If a dataset fetch fails, handle the error explicitly. A `null` value on
  its own does not distinguish loading from failure; add error state when an
  example needs to show that distinction.
- Missing *individual measurements* should follow the dataset's parsing
  convention (e.g. a non-finite numeric value). Filter invalid measurements
  for the particular calculation without discarding the original rows.

## Name accessors and filtered data

- Define named accessors for source fields used by encodings, filtering, and
  binning: `xValue`, `yValue`, `colorValue`, `binValue`, etc.
  Avoid burying `(d) => d.some_field` inside scale, bin, or rendering
  configuration.
- Pass accessors explicitly when a helper needs to know which field a visual
  channel represents. Derive other meaningful accessors as needed rather
  than scattering repeated property lookups.
- Prefer `filteredData` for a filtered subset. Reserve `data` for the
  original loaded dataset; use `bins` for histogram bins and `bin` for
  each bin, rather than generic `rows` or `bucket` when those names obscure
  the role of a value.
- Use `useMemo` for derived filtered data, bins, and scales when the results
  depend on specific inputs. In a simple histogram:

  ```ts
  const binValue = (penguin: PenguinRow) => penguin.body_mass_g;

  const bins = useMemo(() => {
    if (!data) return null;
    const filteredData = data.filter((penguin) =>
      Number.isFinite(binValue(penguin)),
    );
    if (!filteredData.length) return null;
    return bin<PenguinRow, number>()
      .value(binValue)
      .thresholds(targetBinCount)(filteredData);
  }, [data]);
  ```

## Separate hooks from visualization components

- Put `ResizeObserver` and its lifecycle/cleanup in a **local
  `useDimensions.ts`** hook for every example that measures its container.
  Do not inline the observer or its effect in the chart component.
- Copy the existing `useDimensions.ts` from `019-single-histogram` or
  another numbered example. Every example remains self-contained; do not
  import another numbered example's implementation.
- Consume the hook directly:

  ```tsx
  const { ref: containerRef, dimensions: size } = useDimensions();
  // ...
  return <div ref={containerRef} className="relative w-full h-full">...</div>;
  ```

- Keep data fetching in a dataset hook and other independently useful
  derived/lifecycle behavior in small, purpose-named hooks when extraction
  improves clarity. A one-off memo for bins or scales can stay in the main
  component; do not create hooks merely for an extra file.
- Guard rendering when dimensions or data are unavailable rather than using
  fake scale domains during loading.

## React owns structure; D3 renders marks

- React creates the responsive `<svg>`, static text/labels, and empty
  container groups (such as `<g ref={marksRef} className="marks" />`).
  D3 fills those groups with data-driven visual marks and ticks.
- Prefer a dedicated `renderMarks.ts` function, or a specific name such as
  `renderCircles.ts` / `renderBars.ts`, to render data-driven SVG elements.
  Call it from a `useEffect` after checking data, scales, and the ref.
- A render helper receives a D3 `selection` and a typed `options`
  object. Name the selection parameter **`selection`**, and use D3's
  `.selectAll(...).data(...).join(...).attr(...)` pattern:

  ```ts
  export function renderMarks(
    selection: Selection<SVGGElement, unknown, null, undefined>,
    { bins, xScale, yScale, binGap }: RenderMarksOptions,
  ) {
    selection
      .selectAll<SVGRectElement, HistogramBin>('rect')
      .data(bins)
      .join('rect')
      .attr('x', (bin) => xScale(bin.x0) + binGap / 2)
      .attr('width', (bin) => xScale(bin.x1) - xScale(bin.x0) - binGap)
      .attr('y', (bin) => yScale(bin.length))
      .attr('height', (bin) => yScale(0) - yScale(bin.length));
  }
  ```

- Do not use JSX `data.map(...)` to render circles, bars, or other
  data-driven marks in these D3 examples. Use JSX for fixed, non-data-driven
  labels and markup; use D3 axes because they generate ticks dynamically.
- Keep a basic static example static: do not add transitions, hover state,
  tooltips, or complex joins unless the example is specifically teaching them.
- Split into separate React layer components (`Marks`, `Axes`, `Labels`,
  etc.) when layers have distinct logic, props, or interaction state. For
  small charts, simple group refs and effects in one entry component are
  preferable to a forest of one-line wrappers.

## Prefer clear scale, axis, and geometry expressions

- Keep adjustable values in named constants: `margin`, `targetBinCount`,
  `binGap`, `xAxisTicks`, `yAxisTicks`, font sizes, and offsets.
  Put a few constants at the top of the component file; extract `config.ts`
  only when configuration is shared or large enough to justify it.
- Destructure scales after the effect's guard rather than repeatedly writing
  `scales.xScale` and `scales.yScale`:

  ```ts
  if (!scales || !xAxisRef.current || !yAxisRef.current) return;
  const { xScale, yScale } = scales;
  select(xAxisRef.current).call(axisBottom(xScale).ticks(xAxisTicks));
  select(yAxisRef.current).call(axisLeft(yScale).ticks(yAxisTicks));
  ```

- Prefer `axisLeft(yScale).ticks(yAxisTicks)` to manually calculating
  `yScale.ticks(...)` and supplying `tickValues` without a reason.
- For histogram bars, pass `binGap` through the options object. Derive both
  the x offset and bar width from the same constant. Avoid buried `0.5`
  and `1` literals.
- Prefer direct width/height arithmetic to routine `Math.max(0, ...)`
  clamping when the data and dimensions establish the intended geometry.
  Add constraints or clamping only for a real supported edge case.

## TypeScript and defensive programming

- Use TypeScript's strict types, but keep type work at meaningful boundaries.
  D3's `Bin` types mark `x0`/`x1` optional. If validated nonempty
  finite input guarantees bounds for a given use, express that guarantee
  once with an appropriate narrowed type or localized type assertion, not
  repeated `!` operators on every bin.
- Don't claim a value is non-null unless the preconditions warrant it. For a
  genuinely optional value, handle it explicitly.
- Avoid repeated fallbacks (`?? 0`, etc.) within scales and marks after
  loading/empty-data guards have established their inputs.
- Prefer a readable expression over a defensive abstraction introduced only
  for hypothetical cases.

## Before opening an example PR

- Read this guide, the
  [example-creation skill](../.pi/skills/example-creation/SKILL.md), and one
  nearby example with comparable behavior.
- Confirm the local loader preserves every row and column, the relevant
  data-derived values have accessors, loading state uses `null`, all
  necessary hooks/helpers are local, and data-driven marks use a D3 join.
- Check the dataset manifest, numbering, and `src/examples/index.ts`.
- Run `npm run validate:examples`, lint, build, formatting, and a visual
  check. If a check was not run, say so in the PR description.
