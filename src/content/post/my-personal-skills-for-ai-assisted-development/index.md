---
title: "My Personal AI Skills for React, Three.js and Spring Boot Development"
description: "A collection of agent skills that encapsulates my preferred patterns across the frontend and backend stack I use daily."
publishDate: 2026-03-13
tags: ["ai", "agents", "react", "threejs", "developer-tools"]
draft: false
---

I've hit an inflection point with AI agents in my workflow.

I've been using OpenCode on my daily projects — 3D visualizations with Three.js + MapLibre, complex state management with Redux Toolkit, REST APIs with Spring Boot — and the experience has been... inconsistent. The agent knows `useSelector` exists, but not how to structure normalized state. It knows Three.js has a renderer, but not how to handle the depth buffer when combined with MapLibre. It generates "standard" Spring Boot that violates the hexagonal architecture we run in production.

The problem isn't the AI. The problem is I haven't given it enough context about *how I work*.

The solution: a [skills](https://agentskills.io) repository that encodes my preferences, patterns and gotchas so any compatible agent can load them. Skills follow the [open Agent Skills standard](https://agentskills.io), supported by OpenCode, Claude Code, Cursor, Windsurf, Copilot and [many more](https://skills.sh).

## What is a skill

A skill is a folder with:

- **SKILL.md** — frontmatter metadata (`name`, `description`) plus markdown instructions
- **references/** — additional documentation, code examples
- **scripts/** — optional executable scripts

The agent loads metadata first and full instructions only when the skill is relevant to the task.

## Frontend skills

### `react-redux-toolkit`

My pattern is clear: normalized state with `createEntityAdapter`, thunks only for side effects, memoized selectors with `createSelector`, and slices that know nothing about the UI. What I avoid: local state for things that are global, mutations outside Immer, and `any` in selector types.

This skill covers my slice structure conventions, how to type `RootState` correctly, and when to use RTK Query vs manual thunks.

### `threejs-maplibre`

Combining Three.js with MapLibre has nuances you won't find in any tutorial. The shared depth buffer, z-fighting between layers, synchronizing the map camera with the Three.js camera, managing the render loop without breaking MapLibre...

This skill documents my rendering setup: a `CustomLayerInterface`, the shared scene, the GLTF model cache, and how I apply three-point lighting without it looking artificial.

### `maplibre-best-practices`

Kept separate because MapLibre has its own complexity: source and layer management, events, style expressions, and performance with many features. Includes my patterns for dynamic layers and how to avoid unnecessary re-renders when updating map state from React.

## Backend skills

### `spring-boot-hexagonal`

The backend we maintain follows strict hexagonal architecture: domain with no infrastructure dependencies, ports and interfaces in the domain layer, adapters in the infrastructure layer, and application services that orchestrate use cases.

What agents usually get wrong: putting business logic in the controller, using the JPA entity directly as a DTO, or ignoring the bounded context. This skill enforces the right pattern from the first message.

### `java-testing-patterns`

Tests with JUnit 5, Mockito for port mocks, Testcontainers for integration with a real database. No `@SpringBootTest` for unit tests. Naming conventions that make clear what is being tested and why.

## Advanced software development skills

Beyond the specific stack, some cross-cutting skills improve quality regardless of technology:

### `systematic-debugging` _(obra/superpowers)_

Instead of asking the agent to "fix the bug", this skill teaches it to form hypotheses, narrow the search space, and verify before touching code. Less trial and error, more structured diagnosis.

```bash
npx skills add obra/superpowers systematic-debugging
```

### `architecture-patterns` _(wshobson/agents)_

Software architecture patterns applied in practice: when event-driven makes sense, when CQRS is worth it, how to structure modules so they scale without becoming a big ball of mud.

```bash
npx skills add wshobson/agents architecture-patterns
```

### `api-design-principles` _(wshobson/agents)_

Well-designed REST API contracts: consistent naming, coherent error handling, versioning, pagination. Prevents the agent from generating APIs you'll have to break in three months.

```bash
npx skills add wshobson/agents api-design-principles
```

### `test-driven-development` _(obra/superpowers)_

TDD applied pragmatically. Not dogmatic, but with clear criteria for when writing the test first actually changes the design for the better.

```bash
npx skills add obra/superpowers test-driven-development
```

### `code-review-excellence` _(wshobson/agents)_

Useful both for requesting reviews and having the agent review code before committing. Covers what to look for beyond obvious errors: cohesion, coupling, clarity of intent.

```bash
npx skills add wshobson/agents code-review-excellence
```

## Quick install

```bash
# Frontend
npx skills add https://github.com/mindrally/skills --skill redux-toolkit
npx skills add https://github.com/cloudai-x/threejs-skills --skill threejs-animation
npx skills add https://github.com/cloudai-x/threejs-skills --skill threejs-lighting
npx skills add fdieguez/skills maplibre-best-practices

# Backend
npx skills add https://github.com/github/awesome-copilot --skill java-springboot
npx skills add https://github.com/lexler/skill-factory --skill hexagonal-architecture
npx skills add https://github.com/pluginagentmarketplace/custom-plugin-java --skill java-testing

# Advanced
npx skills add obra/superpowers systematic-debugging
npx skills add obra/superpowers test-driven-development
npx skills add wshobson/agents architecture-patterns
npx skills add wshobson/agents api-design-principles
npx skills add wshobson/agents code-review-excellence
```

## Why it's worth the effort

Creating a skill is basically documenting what you already know. The benefit is twofold: the agent works within your standards from the very first message, and writing it forces you to be explicit about decisions that are usually tacit.

I'll keep publishing skills as I complete them. If you work with a similar stack, I hope they save you the same time they save me.

The repository will be at [github.com/fdieguez/skills](https://github.com/fdieguez/skills) once the first skills are ready to share.