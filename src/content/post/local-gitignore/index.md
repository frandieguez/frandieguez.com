---
title: "A .gitignore that is only yours"
description: "Ignoring files in a shared repository without touching the shared .gitignore — the two ways Git offers, and the one that silently switches off your global ignores if you are not expecting it."
publishDate: "05 Mar 2025"
lang: "en-GB"
tags: ["git", "gitignore"]
draft: true
---
Every shared repository eventually collects files that are yours alone. A scratch script, a `notes.md`, a dump of production data you are debugging against, the config for an editor nobody else on the team uses.

They do not belong in the project's `.gitignore`, because they are not the project's business. But they do need ignoring, because `git status` full of noise is `git status` nobody reads.

Git has two answers. The first is simpler than most people realise, and the second has a sharp edge.

## The simple one: `.git/info/exclude`

This file already exists in every repository you have ever cloned, and it does exactly this job. Same syntax as `.gitignore`, never committed, applies only to your copy.

```bash
echo "notes.md" >> .git/info/exclude
echo "scratch/" >> .git/info/exclude
```

That is the whole feature. No configuration, nothing to set up, nothing that can conflict with anything else.

Its one real drawback is that it is buried inside `.git/`, which makes it easy to forget and awkward to edit — and if you ever delete and re-clone the repository, it goes with it.

## The other one: a file in the working tree

If you would rather have the list somewhere you can see it, you can keep it as a normal file and point Git at it.

**Create it:**

```bash
touch .local.gitignore
```

**Stop Git from offering to commit it**, using the mechanism above:

```bash
echo ".local.gitignore" >> .git/info/exclude
```

**Tell Git to read it:**

```bash
git config --local core.excludesfile .local.gitignore
```

Now it behaves like a `.gitignore` that nobody else has:

```bash
echo "my-secret-file.txt" >> .local.gitignore
echo "debug_logs/" >> .local.gitignore
```

## The sharp edge

`core.excludesFile` is a single value, not a list. Setting it locally does not *add* your file to the ones Git already consults — it **replaces** whatever was there, which for most people is the global ignore file in `~/.gitignore_global`.

Here is that happening, in a fresh repository:

```bash
$ git config --local core.excludesfile ~/.gitignore_global
$ git status --short
?? local-secret.txt          # .DS_Store etc. correctly ignored

$ git config --local core.excludesfile .local.gitignore
$ git status --short
?? global-ignored.txt        # ← back, and it will not come out again
?? .local.gitignore
```

Everything your global file was quietly handling — `.DS_Store`, `*.swp`, `.idea/`, whatever you accumulated over the years — stops being ignored in this repository. Nothing warns you. You just start seeing noise you have not seen in so long that you may not connect it to a setting you changed last week.

:::caution
The risk is not the noise, it is the opposite: a global ignore you rely on to keep something *out* of commits stops applying, in one repository, silently. Check what you are replacing before you replace it — `git config --get --global core.excludesfile` — and if the answer is not empty, copy its contents into your local file.
:::

That caveat is why I use `.git/info/exclude` and not this. The convenience of having the file in the working tree is real, and it is not worth switching off a safety net you set up years ago and have not thought about since.

## Before you undo a commit

One more, which applies to both approaches.

Ignored files are untracked files. Git is not storing them anywhere, so anything that rewinds your working tree — `git reset --hard`, `git checkout` of another branch over them, `git clean` most of all — treats them as expendable, because as far as Git is concerned they never existed.

```bash
# Will delete every ignored file, including the ones you meant to keep.
git clean -fdx
```

If you are about to rewind history and there is anything in those directories you care about, copy it out first. There is no reflog for a file that was never committed.
