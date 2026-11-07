# Constructing Visualizations (2026)

[YouTube Playlist](https://www.youtube.com/watch?v=Exdnvbm8uQ8&list=PL9yYRbwpkykt6c23sKt8yJ-vhaSU6eXIK)

## Repository guide

This repository accompanies the **2026 Constructing Visualizations** teaching materials. The weekly reading and video links below are course content; they are not a release plan or a guarantee that every chapter is implemented.

The checked-in `package.json` provides a Vite development workflow:

```bash
npm ci
npm run dev
npm run validate:examples
npm run lint
npm run build
```

- [`src/`](src/) contains the application and examples; [`docs/`](docs/) contains supporting material.
- [`scripts/validate-examples.mjs`](scripts/validate-examples.mjs) is the repository-specific example validation entry point; it does not replace visual inspection of individual examples.
- [`AGENTS.md`](AGENTS.md) contains repository development guidance.
- See [VizHub](https://vizhub.com/) for the visualization platform; this source repository is a separate educational project.

## Week 1

Read:

- Visualization Analysis and Design, Chapter 1
- https://d3js.org/what-is-d3
- https://react.dev/learn
- https://tailwindcss.com/docs/styling-with-utility-classes

Read/Skim:

- https://vite.dev/guide/
- https://opencode.ai/docs
- https://openrouter.ai/
- https://reactrouter.com/home

Watch:

- [CV26 Episode 1: Course Intro](https://www.youtube.com/watch?v=Exdnvbm8uQ8&list=PL9yYRbwpkykt6c23sKt8yJ-vhaSU6eXIK)
- [CV26 Episode 2: Chapter 1 VAD](https://www.youtube.com/watch?v=PnhYp_fRe1s&list=PL9yYRbwpkykt6c23sKt8yJ-vhaSU6eXIK&index=2)
- [CV26 Episode 3: Setting Up the Repo](https://www.youtube.com/watch?v=myzVpobkP-Q&list=PL9yYRbwpkykt6c23sKt8yJ-vhaSU6eXIK&index=3)
- [CV26 Episode 4: Pseudo Visualizations](https://www.youtube.com/watch?v=JVP6hmkvYAQ&list=PL9yYRbwpkykt6c23sKt8yJ-vhaSU6eXIK&index=4)
- CV26 Episode 5: Adopting Tailwind
- CV26 Episode 6: Adopting Tailwind
- CV26 Episode 7: React Router Examples Navigation
