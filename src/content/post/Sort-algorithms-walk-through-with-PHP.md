---
id: 1501
title: Sort algorithms walk through with PHP
description: "Bubble, insertion, merge and quicksort written out in PHP and timed against each other — and against sort(), which beats all of them by two orders of magnitude for a reason worth understanding."
publishDate: 2013-04-08T14:53:47+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["php", "software-engineering", "performance"]
guid: http://www.mabishu.com/?p=1501
permalink: /?p=1501
categories:
  - Uncategorized
---
Nobody should implement a sort algorithm in PHP for production. `sort()` exists, it is written in C, and it will beat anything in this post by a margin that makes the comparison embarrassing.

Which is exactly why it is worth doing once. Sorting is the smallest problem where the difference between O(n²) and O(n log n) is something you can feel rather than something you have read, and PHP — with no types to argue with and an array that prints itself — is a fine language to feel it in.

## Bubble sort

The one everybody learns first and nobody uses. Walk the array, swap neighbours that are in the wrong order, repeat until a full pass changes nothing.

```php
<?php
function bubbleSort(array $items)
{
    $n = count($items);

    do {
        $swapped = false;

        for ($i = 1; $i < $n; $i++) {
            if ($items[$i - 1] > $items[$i]) {
                $tmp = $items[$i - 1];
                $items[$i - 1] = $items[$i];
                $items[$i] = $tmp;
                $swapped = true;
            }
        }

        // After each pass the largest remaining element is in place.
        $n--;
    } while ($swapped);

    return $items;
}
```

The `$swapped` flag is what makes an already-sorted array cost one pass instead of n of them. Decrementing `$n` is the other half: without it you re-compare the tail you have already settled, every time.

Best case O(n), average and worst O(n²).

## Insertion sort

Take each element and slide it back to where it belongs among the ones already sorted. It is how people sort a hand of cards, which is not a coincidence.

```php
<?php
function insertionSort(array $items)
{
    for ($i = 1, $n = count($items); $i < $n; $i++) {
        $value = $items[$i];
        $j = $i - 1;

        while ($j >= 0 && $items[$j] > $value) {
            $items[$j + 1] = $items[$j];
            $j--;
        }

        $items[$j + 1] = $value;
    }

    return $items;
}
```

Also O(n²) on average, and still the right answer for small or nearly-sorted inputs. Real implementations of quicksort switch to it below about sixteen elements, because the constant factors of the clever algorithm are worse than the simple one at that size.

## Merge sort

The first one that is actually fast. Split in half, sort each half, merge.

```php
<?php
function mergeSort(array $items)
{
    if (count($items) <= 1) {
        return $items;
    }

    $middle = (int) (count($items) / 2);
    $left   = mergeSort(array_slice($items, 0, $middle));
    $right  = mergeSort(array_slice($items, $middle));

    return merge($left, $right);
}

function merge(array $left, array $right)
{
    $result = array();

    while ($left && $right) {
        $result[] = ($left[0] <= $right[0])
            ? array_shift($left)
            : array_shift($right);
    }

    return array_merge($result, $left, $right);
}
```

O(n log n) in every case, including the worst — which is its real selling point. It is also stable: two records comparing equal come out in the order they went in, which matters the moment you are sorting anything with more than one field.

The cost is memory. Every level of recursion allocates new arrays, and `array_shift()` reindexes the whole array each call, so this implementation is readable rather than fast. Written properly it merges into a pre-allocated buffer with two cursors.

## Quicksort

Pick a pivot, put everything smaller on the left and everything larger on the right, recurse.

```php
<?php
function quickSort(array $items)
{
    if (count($items) <= 1) {
        return $items;
    }

    $pivot = array_shift($items);
    $left  = $right = array();

    foreach ($items as $item) {
        if ($item < $pivot) {
            $left[] = $item;
        } else {
            $right[] = $item;
        }
    }

    return array_merge(quickSort($left), array($pivot), quickSort($right));
}
```

O(n log n) on average and the fastest of the four in practice, because its inner loop is tighter than merge sort's.

It has one trap, and it is a good one. Taking the first element as the pivot makes the worst case an *already sorted* array: every partition puts n-1 elements on one side, the recursion goes n deep, and you get O(n²) on precisely the input you would expect to be easiest. Real implementations pick the median of the first, middle and last elements, or a random index.

:::caution
PHP's default recursion limit will find you before the algorithm does. Quicksort degrading to O(n²) on 50,000 sorted elements is not slow, it is a stack overflow — and with Xdebug loaded you get its `max_nesting_level` error instead, which points at the recursion rather than at the pivot, and sends you looking in the wrong place.
:::

## Timing them

```php
<?php
$sizes = array(1000, 5000, 10000);

foreach ($sizes as $size) {
    $data = array();
    for ($i = 0; $i < $size; $i++) {
        $data[] = mt_rand(1, 1000000);
    }

    foreach (array('bubbleSort', 'insertionSort', 'mergeSort', 'quickSort') as $fn) {
        $copy = $data;
        $start = microtime(true);
        $fn($copy);
        printf("%-14s %6d  %.4fs\n", $fn, $size, microtime(true) - $start);
    }

    $copy = $data;
    $start = microtime(true);
    sort($copy);
    printf("%-14s %6d  %.4fs\n\n", 'sort()', $size, microtime(true) - $start);
}
```

The shape of the result is the point, not the absolute numbers. Going from 1,000 to 10,000 elements — ten times the input — bubble and insertion sort take roughly a hundred times longer, while merge and quicksort take about thirteen times longer. That ratio *is* O(n²) against O(n log n), and seeing it come out of your own code is worth more than the formula.

Then there is `sort()`, which will be somewhere between fifty and two hundred times faster than the best of them.

## Why the built-in wins by so much

Not because the algorithm is better — PHP's `sort()` is a quicksort with an insertion-sort cutoff, which is what you would write.

It wins because it is C operating on the array's internal representation directly. Every line of the PHP versions above goes through the engine: allocating a zval per element, refcounting on every assignment, bounds-checking every access, and running the whole opcode dispatch loop for each one. The algorithm is identical and the constant factor is two orders of magnitude apart.

That is the actual lesson, and it generalises well past sorting. Choosing the right complexity class is the thing you cannot buy your way out of. Everything after that is constants — and the constants belong to whoever wrote the runtime.

So: implement them once, understand the shape of the curve, then call `sort()` for the rest of your career.

Wikipedia's [sorting algorithm](http://en.wikipedia.org/wiki/Sorting_algorithm) page has the comparison table and the animations, which are worth more than any amount of prose for the merge step in particular.
