# Flutter Layout Overflow

## Problem

A `Row` was used to place two fixed-width containers side by side.

Each container had a width of `250` pixels, requiring a total of `500` pixels.

On smaller screens, there was not enough horizontal space, causing Flutter to report a horizontal layout overflow.

## Before

The problematic layout was:

    Row(
      children: [
        Container(
          width: 250,
          height: 200,
          color: Colors.blue,
        ),
        Container(
          width: 250,
          height: 200,
          color: Colors.green,
        ),
      ],
    )

## What went wrong?

`Row` lays its children out horizontally.

The two containers require:

    250 + 250 = 500 pixels

If the available screen width is less than `500` pixels, the children cannot fit.

Flutter therefore reports a horizontal overflow.

## Fix

Instead of forcing both containers to use fixed widths, allow them to share the available space using `Expanded`.

The fixed-width containers become:

    Row(
      children: [
        Expanded(
          child: Container(
            height: 200,
            color: Colors.blue,
          ),
        ),
        Expanded(
          child: Container(
            height: 200,
            color: Colors.green,
          ),
        ),
      ],
    )

Now both containers divide the available width between them instead of requiring a fixed `500` pixels.

## Root Cause

The layout used fixed-width widgets inside a `Row` without considering smaller screen sizes.

## Lesson

Avoid hard-coded widths when a responsive layout is required.

Flutter provides widgets such as `Expanded` and `Flexible` to help children adapt to the available space.

## Files

- `before-after.dart` - Complete buggy example.
- `README.md` - Explanation of the bug, cause, and solution.