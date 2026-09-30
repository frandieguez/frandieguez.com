---
title: "I asked DeepSeek to introduce itself"
description: "DeepSeek V3 arrived with open weights and an API an order of magnitude cheaper than anyone else. I asked it to describe its own capabilities, and the answer is more revealing for what it leaves out than for what it claims."
publishDate: "10 Jan 2025"
lang: "en-GB"
tags: ["deepseek", "ai", "llm", "code-assistant"]
draft: true
---
DeepSeek V3 landed at the end of December with two claims that are hard to ignore: open weights you can actually download, and API pricing roughly an order of magnitude below the frontier models. For anyone who has priced an assistant into a real workflow, the second one is the interesting number.

So before forming an opinion I did the obvious thing and asked it to describe itself. What follows is its answer, lightly trimmed, followed by what I think it tells you.

## The self-description

> **Hello, World! 👋 I'm the Code Assistant.**
>
> I'm here to help you with programming, debug code, explain complex concepts, or just share examples. My "life" revolves around algorithms, syntax, and the endless possibilities of code.
>
> **What I can do**
> - Generate code examples in different languages.
> - Explain how specific lines of code work.
> - Find bugs and suggest fixes.
> - Share optimization tips.

Asked for demonstrations, it produced these. They are its output, not mine:

```python title="factorial.py"
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))  # 120
```

```js title="countdown-timer.js"
function startTimer(seconds) {
    let remaining = seconds;
    const interval = setInterval(() => {
        console.log(`Time left: ${remaining} sec.`);
        remaining--;
        if (remaining < 0) {
            clearInterval(interval);
            console.log("Time's up! ⏰");
        }
    }, 1000);
}

startTimer(5);
```

```sql
SELECT users.name, COUNT(orders.id) AS total_orders
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.name
HAVING total_orders > 3;
```

And an optimisation, going from a nested loop to a single pass:

```python
# Before — O(n²)
duplicates = []
for i in range(len(numbers)):
    for j in range(i+1, len(numbers)):
        if numbers[i] == numbers[j]:
            duplicates.append(numbers[i])

# After — O(n)
from collections import defaultdict

counts = defaultdict(int)
duplicates = []
for num in numbers:
    if counts[num] > 0:
        duplicates.append(num)
    counts[num] += 1
```

## What is actually going on here

The code is correct. Every snippet runs, the complexity claim is right, and the SQL is valid.

It is also, every bit of it, the most canonical possible answer to the most canonical possible question. Recursive factorial. A `setInterval` countdown. A `LEFT JOIN` with `HAVING`. Deduplication with a hash map. These are not demonstrations of capability, they are the centre of the training distribution — the examples that appear ten thousand times in any corpus scraped off the public web.

That is not a criticism of DeepSeek specifically. Ask any of the current models to introduce itself and you will get the same genre of answer, because "show me what you can do" is an invitation to produce the average of everything it has seen. It is a criticism of the question, and of evaluating assistants by asking them to audition.

Two details are worth pulling out, though.

The `HAVING total_orders > 3` line references a column alias. MySQL allows that; PostgreSQL and the SQL standard do not — you would need `HAVING COUNT(orders.id) > 3`. The model produced a dialect-specific answer to a dialect-free question without mentioning that it had chosen a dialect. That is the failure mode that matters with these tools, and it is not "it wrote wrong code". It is "it wrote code that is right somewhere, and did not say where".

The optimisation is the other one. It is genuinely a correct O(n) rewrite, and it also changes the behaviour: an element appearing three times is appended twice by the first version and once by the second. Nothing in the answer mentions this. If you were optimising real code on the strength of that, you have just changed your output and been told it was a speedup.

## The part that will decide it

None of the above is what makes DeepSeek interesting in January 2025. What makes it interesting is the pricing and the open weights.

An assistant that costs a tenth as much per token changes what you can put it in front of. Reviewing every diff, summarising every failing build, a first pass over every log — the things where the value per call is real but small, and where frontier pricing makes the arithmetic not work. And weights you can download means the option of running it somewhere your customers' code is allowed to go, which for a lot of people is the whole question and not a detail.

Whether the quality holds at the edges — unusual languages, large existing codebases, anything where the answer is not in the middle of the distribution — is not something a self-introduction can tell you. That takes running it against work you already know the answer to.

Which is the only evaluation method I have found that means anything: give it a problem you have already solved, and see whether it finds the thing that made it hard. The canonical answers are free now. What you are buying is the behaviour past the point where the canonical answer runs out.

:::tip
If you take one habit from this: ask every assistant which dialect, version or runtime it assumed. The answers are usually reasonable and almost never stated, and that gap is where the afternoon goes.
:::
