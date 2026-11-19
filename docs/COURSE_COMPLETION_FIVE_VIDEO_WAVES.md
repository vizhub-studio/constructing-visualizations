# Constructing Visualizations — Five-Video Completion Plan

**Goal:** Finish the core course with **five synthesis videos**, not 59 separate roadmap videos. Existing examples through **020** have videos (instructor-confirmed); **PR #49 / Example 021** is the outstanding unrecorded lesson. Keep the [full roadmap](UPDATED_COURSE_ROADMAP.md) and [video/PR DAG](PROGRESS_AND_VIDEO_PR_DAG.md) as the optional expansion plan.

## Five final videos

| # | Video | Essential live demonstration | Roadmap coverage |
| --- | --- | --- | --- |
| 1 | **Histograms → Crossfiltering** | Small multiples → interval brush → linked histograms → matching-records table | Ch. 6 |
| 2 | **Composition, Time & Color** | Grouped vs. stacked/normalized bars; multiline time series; intentional color scales | Ch. 7, 10 |
| 3 | **Different Kinds of Space** | One choropleth, one network layout, one hierarchy layout; compare their data structures | Ch. 8–9 |
| 4 | **Scale & Semantic Space** | Measure a crossfilter baseline → offload computation to a worker; embedding/UMAP scatterplot with cluster or zoom interaction | Ch. 11, 13–14 |
| 5 | **Build a Visualization System** | Complete coordinated explorer: load → transform → encode → interact → share state → evaluate/refactor | Ch. 12, 15 |

Aim for **20–30 minutes per video**. Prefer one coherent, reproducible narrative over exhaustive chart variants.

## Waves and parallel workstreams

| Wave | Parallel work | Serial gates / output |
| --- | --- | --- |
| **0 — Unblock** | Verify datasets, choose examples and recording outlines for B/C/D | Validate PR #49 (build/lint, bin totals, mobile visuals), **merge to main**, record its missing video/segment |
| **1 — Build** | **A:** brushing, crossfiltering, record table. **B:** composition/time/color. **C:** map/network/hierarchy. **D:** prepare benchmark fixtures and reproducible embedding data | Within A: brush + small multiples **before** crossfilter; crossfilter **before** records table |
| **2 — Record / optimize** | Record **Videos 1–3** as respective demos pass checks. Finalize D's embedding visualization independently | **A's working crossfilter baseline → D's measured worker comparison → Video 4** |
| **3 — Integrate / publish** | Final video edits, captions, playlists, navigation and link audit can proceed alongside capstone polish | Use proven components to finish the **coordinated explorer → Video 5**; publish five videos and update status ledger |

**Critical path:** PR #49 → Video 1 demo → measured worker example (Video 4) → integrated explorer (Video 5). **B and C have no dependency on A or each other** and can be built/recorded concurrently. D's *data preparation* can happen in Wave 1; its *worker comparison* waits for A.

## Implementation rules

- Each workstream uses **independent PRs targeting `main`**; no stacked PRs or cross-example imports.
- Prefer existing datasets and examples; acquire missing datasets with source/licensing/provenance before coding against them.
- Every recording-ready example has a runnable demo, concise teaching outline, reproducibility notes, and passing example validation/lint/build plus a browser visual check. Do not conflate code merged with video published.
- Track **PR, example path, recording status, publication URL** for each video in the existing DAG/status document.
- **Defer:** specialist airport/county-migration explorers, exhaustive hierarchy variants, advanced bitset/indexed crossfilter engines, and server-side infrastructure. These belong in an advanced series, not the five-video release.

**Done when:** PR #49 is resolved; all five demonstrations are verified; all five videos are published and linked from the course; remaining optional roadmap nodes are explicitly marked deferred.
