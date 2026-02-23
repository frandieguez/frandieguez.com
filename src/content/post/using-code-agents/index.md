---
title: "Code Agents: From Writing Code to Controlling the Code That Writes Itself"
description: "What code agents actually are, how they work internally, and how to use them without losing control of your codebase. A deep dive into the ReAct loop, the skill system, OpenCode, and the security considerations nobody talks about."
pubDate: 2026-02-23
tags: ["ai", "agents", "opencode", "claude-code", "developer-tools", "productivity"]
heroImage: "./opencode-screenshot.webp"
---


*"We're not asking if you trust AI. We're asking if you know how to control it."*

I recently gave a talk at Situm about code agents — what they actually are, how they work internally, and how to use them without losing control of your codebase. The feedback was great, so I'm expanding that material here with more context and the things I couldn't fit into 15 slides.

---

## The Matrix We're Already Living In

Every developer knows the grind: refactoring components for the third time this week, writing yet another CRUD test that looks exactly like the last fifty, spending two hours debugging something that turns out to be a missing null check. The kind of work that keeps the lights on but doesn't move anything forward.

The pitch I made at Situm was simple: **40% of the code you write today could be generated and executed by an agent autonomously**. That's not a distant future. It's available right now, and the developers who figure out how to work with it — not just use it — are going to have a significant advantage.

---

## The Real Shift: Assistants vs Agents

There's a distinction that matters a lot and gets blurred constantly in the tooling conversation.

An **AI assistant** (Copilot, the classic ChatGPT experience, Codeium) suggests code in your editor. You read the suggestion, decide if it's good, and press Tab. It reacts to your cursor. It has no access to your system and no ability to verify whether what it generated actually works. You are the execution layer.

An **AI agent** is different in kind, not just degree. It plans. It acts. It observes the result, detects errors, and corrects course. It has a loop:

```
Analyze the goal and plan steps
        ↓
Execute: edit files, run commands, search
        ↓
Read the result and detect errors
        ↓
Repeat until done
```

This is the ReAct pattern (Reason + Act) applied to software development. The agent is not waiting for you to approve each step — it's running the whole thing, checking its own output, and iterating until it reaches a working state or hits something it genuinely can't resolve.

The practical implication: you stop being the person who types the code and become the person who defines the task, reviews the result, and steers direction. That's a different job, and it's a better one.

---

## How It Actually Works Internally

When I stripped away the marketing in the presentation and explained what's actually happening under the hood, a few things clicked for people.

**Memory (context)** is everything. The agent's "understanding" of your project is whatever fits in its context window: conversation history, relevant files it's read, results of previous commands, error messages it's observed. There's no persistent brain between sessions unless you explicitly set one up. This is why tools like `opencode-agent-memory` exist — they give the agent a way to persist knowledge across sessions.

**The brain (the model)** is swappable. Depending on the tool you're using, you can route different tasks to different models — a fast, cheap model for mechanical tasks, a more capable one for complex reasoning. This matters for cost and for getting the right quality on the right problems.

**Tools** are what let the agent actually do things in your world:

- *Internal tools*: file I/O (read, write, edit files), shell execution, glob search, diff application
- *External tools*: browser plugins, MCP servers (a protocol that lets agents connect to external services — databases, APIs, documentation systems)

An agent without tools is, as I put it in the talk, like Neo before he takes the red pill: it exists, it reasons, but it can't do anything in your world. The tools are the jack in the back of the neck.

---

## The Skill System: "I Know Kung Fu"

This was the part of the talk that generated the most questions, so it deserves more space here.

Skills are reusable knowledge packages that you install into your agent. They're typically markdown files that define a specific domain of expertise: how to work with Kotlin coroutines, how to apply a particular design system, what the correct patterns are for Spring Boot hexagonal architecture, how to structure a React component with RTK Query.

The best analogy from the talk was the Matrix training scene: Tank uploads "I know Kung Fu" directly into Neo's brain in seconds. Skills do the same thing for agents — instead of the agent hallucinating Spring Boot idioms or guessing your team's conventions, you give it the actual knowledge upfront.

The central repository for community skills is **[skills.sh](https://skills.sh)**, maintained largely by Vercel Labs but open to anyone. You install them with a single command:

```bash
npx skills add cloudai-x/threejs-skills --all -a opencode -g -y
```

A few skill packages worth knowing about:

**[Superpowers](https://github.com/obra/superpowers)** is the one I use most heavily. It turns the agent into something closer to a senior developer: it plans before acting, writes tests before implementation, verifies its work before declaring completion, and knows when to ask for clarification vs. when to just decide. The difference in output quality between a raw agent and an agent with Superpowers loaded is significant.

**[GSD (Get Shit Done)](https://github.com/glittercowboy/get-shit-done)** takes a different approach — it interviews you about what you want to build, constructs a full spec from your answers, then executes phase by phase with verification gates between each phase. Useful when you have an idea but not a clear implementation plan.

**[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** auto-generates a complete design system before the agent writes any component code. The goal is making AI-generated UIs look like a designer touched them rather than the unmistakable "AI slop" aesthetic.

Skills can also be project-specific and versioned in your repo. If your team has established conventions that aren't public knowledge — a particular way of handling errors, a specific API client pattern, your database naming conventions — you can encode that as a skill and every agent working in the project will follow it automatically.

---

## The Tools Landscape

The market is fragmented but converging. In the talk I covered the main players:

**Claude Code** (Anthropic) is the most capable in terms of reasoning and handling long, complex contexts. It's a CLI tool, which means it integrates naturally with your existing terminal workflow. The context window handling is genuinely better than most alternatives for large codebases.

**Codex / ChatGPT** (OpenAI) is deeply integrated with the OpenAI ecosystem. If you're already paying for ChatGPT Pro and using OpenAI APIs, the integration is smooth.

**Cursor** is the choice for developers who don't want to leave their IDE. It's VSCode with an agent integrated into the editor itself. Lower barrier to adoption, slightly less powerful for pure agentic tasks.

**Aider** is open source, git-aware, and opinionated about keeping commits clean. Good for teams that want the agent's changes to be traceable and atomic in git history.

![./logo-dark.svg](https://opencode.ai)

**[OpenCode](https://opencode.ai)** is the one I've personally invested the most in, and the one I used for the demos at Situm. It's open source, written in TypeScript, with a terminal UI that keeps you in your workflow. The key advantage is model flexibility: you can use OpenAI, Anthropic, Google Gemini, or local models via Ollama, and you can switch per task or per project. No vendor lock-in. Configuration is JSON files that you can version and share with your team — which means your agent setup is reproducible across machines and teammates.

---

## Security: The Sentinels in the Room

I gave this section more weight than most agent talks do, because I think it's where a lot of teams are going to get hurt if they move fast without thinking.

**API keys and secrets**: Never hardcoded, ever. Environment variables as a minimum. For teams working seriously with agents, tools like Doppler, HashiCorp Vault, or AWS Secrets Manager are worth the setup cost. The agent will write code — you need to make sure it can't accidentally commit a key.

**Minimum permissions**: The agent should only have access to what it needs to complete the task. No admin credentials. No direct production access. This sounds obvious but it gets violated constantly because "it's just temporary" or "I trust the model." Blast radius management is the principle: if something goes wrong, how bad can it get?

**Code review**: Generated code can introduce subtle vulnerabilities — not because the model is malicious, but because it optimizes for "working" and not always for "secure." SQL injection, insecure deserialization, missing authorization checks. These can appear in plausible-looking code. Always review before merging, at least until you've calibrated your trust in a particular agent + skill combination for a particular task type.

**Sandboxing**: Running the agent in Docker is the practical answer for anything involving shell execution. Limit what the container can see and touch. This is exactly what I built for my own OpenCode setup — a container script that mounts only what the agent needs, with explicit port and volume controls.

**Third-party skills**: Treat them like any other dependency. Read the code before installing globally. A malicious skill is effectively a prompt injection attack at the system level.

**Logs and context**: The agent's context can contain sensitive information that ends up in logs. Know where those logs go and who can access them. This is especially relevant if you're routing through a third-party API.

---

## Practical Recommendations for Getting Started

Based on what worked at Situm and what I've learned from my own setup:

**Start with a well-defined, bounded task.** The worst introduction to agents is giving them "refactor this whole module." The best introduction is "add a unit test for this specific function" or "extract this logic into a service following this pattern." Once you see the loop work on something small, you develop intuition for what works.

**Invest in your skills setup before you need it.** Writing good skills for your project conventions upfront saves enormous amounts of correction later. If your team has a design system, encode it. If you have a specific error handling pattern, encode it. The agent will follow it consistently in a way that code reviews alone can't guarantee.

**Use an `AGENTS.md` file in your project root.** This is a convention that most agents respect — it's a markdown file that describes the project, its conventions, and specific instructions for the agent. Think of it as onboarding documentation for your AI teammates.

**Run it in Docker from day one.** The container overhead is minimal and the security boundary is worth it. Don't get comfortable with the agent running directly on your machine with full filesystem access.

**Review everything before it touches main.** This isn't about distrust — it's about calibration. You need to build a mental model of what this agent + skill combination does well and where it needs guidance. That model develops through review, not through blind merging.

---

## Where This Goes

The conclusion I drew at Situm, and that I still hold: agents don't replace developers, they multiply developer productivity. A good developer with well-configured agents can cover ground that would previously require a team. A mediocre agent without human oversight produces mediocre, sometimes dangerous output.

The future is persistent memory across sessions, more specialized agents for specific domains, and tighter integration between the agent and the tools your team already uses. Most of that is available today in prototype form and will stabilize over the next year.

The question isn't whether to adopt this. It's whether you're going to understand it well enough to control it.

Take the green pill. Start today.

---

*If you want to talk through any of this in more detail, or if your team is trying to figure out how to integrate agents into your workflow, I'm happy to dig into specifics. Find me on the usual channels.*