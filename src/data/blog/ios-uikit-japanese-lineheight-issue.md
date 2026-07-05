---
title: "iOS - UIKit Japanese LineHeight Issue"
pubDatetime: 2026-07-01T10:50:00.000Z
author: "tadev999"
tags:
  - iOS
  - UIKit
  - Japanese
featured: false
draft: false
description: "iOS - UIKit Japanese LineHeight Issue"
---

# JapaneseLineHeightLabel on iOS

## 1. Problem Summary
When rendering Japanese text on iOS, text can look vertically shifted (usually lower than visual center) when the configured line height is much larger than the font's default line height.

Example:
- Font size: 16
- Target line height: 32
- Symptom: glyphs appear close to the bottom of the line box.

This issue can happen for both single-line and multi-line labels because it is mostly a baseline/glyph-metrics problem, not only a wrapping problem.

## 2. Why It Happens
UIKit line layout depends on font metrics (`ascender`, `descender`, `lineHeight`) and paragraph style.

If only `minimumLineHeight`/`maximumLineHeight` is applied, the text baseline may not be visually centered for Japanese fonts.

In short:
- line box height is fixed,
- but baseline remains font-metric driven,
- causing visual bias to top or bottom depending on font family.

## 3. Class-Based Solution
The class `JapaneseLineHeightLabel` solves this by:

1. Applying fixed line height through `NSMutableParagraphStyle`.
2. Computing baseline offset to center text in the target line box:

   `offset = (lineHeight - font.lineHeight) / 2 + customBaselineOffset`

3. Re-applying style when key properties change:
- `text`
- `attributedText`
- `font`
- `textColor`
- `textAlignment`
- runtime layout lifecycle (`awakeFromNib`, `layoutSubviews`)

4. Preventing recursive loops with an internal guard (`isUpdatingText`).

## 4. How To Use

### 4.1 Interface Builder (Storyboard/XIB)
1. Set label class to `JapaneseLineHeightLabel`.
2. Set `lineHeight` (IBInspectable), for example `32`.
3. Optional: set `customBaselineOffset` for fine tuning.
   - Positive value: move text upward.
   - Negative value: move text downward.

### 4.2 Programmatic
```swift
let label = JapaneseLineHeightLabel()
label.font = .systemFont(ofSize: 16)
label.lineHeight = 32
label.customBaselineOffset = 0
label.text = "Hello World"
```

## 5. Recommended Tuning Strategy
1. Start with:
- `customBaselineOffset = 0`
2. If text still looks low:
- increase by small steps (`0.5`, `1.0`, `1.5`)
3. If text looks too high:
- use small negative values (`-0.5`, `-1.0`)

This is font-dependent, so tune per design token/font family.

## 6. Behavior Notes
- For single-line labels, line-height changes are less obvious but baseline correction still applies.
- For multi-line labels, visual effect is clearer.
- If outside code assigns its own attributed string after setup, class will re-normalize to maintain configured line-height behavior.

## 7. Troubleshooting Checklist
If line height appears not applied:

1. Check class mapping in XIB/Storyboard is exactly `JapaneseLineHeightLabel`.
2. Ensure `lineHeight > 0`.
3. Ensure label has non-empty text.
4. Verify no later code overwrites paragraph style unexpectedly.
5. Verify `font` is set before/around text assignment in complicated bindings.
6. Use `customBaselineOffset` for final visual adjustment.

## 8. File Location



