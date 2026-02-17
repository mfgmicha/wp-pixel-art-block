# Code Review: WordPress Pixel Art Block Plugin

## Summary

This is a new WordPress block plugin for creating pixel art drawings. The codebase is well-structured, follows WordPress block development best practices, and includes solid editor functionality with drag-to-paint, touch support, and JSON export.

## Issues Found

| Severity | File:Line | Issue |
|----------|-----------|-------|
| WARNING | `src/edit.js:221` | Uses `window.confirm()` instead of WordPress-native UI |
| WARNING | `src/edit.js:237-247` | Clipboard API lacks HTTPS fallback |
| SUGGESTION | `src/save.js:60` | Large JSON in data attributes may impact performance |

## Detailed Findings

### WARNING: Non-WordPress confirm dialog

**File:** `src/edit.js:221`

**Problem:** Using `window.confirm()` for the "Clear Canvas" confirmation breaks WordPress editor UX consistency.

**Current code:**
```javascript
if (confirm(__('Are you sure you want to clear the canvas?', 'pixel-art-block'))) {
```

**Suggestion:** Replace with a WordPress-native confirmation pattern using custom state:
```javascript
const [showClearConfirm, setShowClearConfirm] = useState(false);
```

---

### WARNING: Clipboard API fallback missing

**File:** `src/edit.js:237-247`

**Problem:** `navigator.clipboard.writeText()` requires a secure context (HTTPS) and may fail in some environments without a fallback.

**Current code:**
```javascript
navigator.clipboard
    .writeText(jsonString)
    .then(() => { /* success */ })
    .catch(() => { /* error */ });
```

**Suggestion:** Add a fallback mechanism:
```javascript
if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonString)
        .then(() => { /* success */ })
        .catch(() => { /* fallback */ });
} else {
    // Fallback for non-secure contexts
    const textarea = document.createElement('textarea');
    textarea.value = jsonString;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
```

---

### SUGGESTION: Large JSON in data attributes

**File:** `src/save.js:60`

**Problem:** Storing pixel arrays as JSON strings in data attributes. For maximum grid sizes (64x64 = 4096 pixels), this could create large DOM attributes affecting parsing/rendering performance.

**Current code:**
```javascript
data-pixels={JSON.stringify(pixels)}
```

**Suggestion:** Consider if storing in data attributes is necessary, since WordPress handles block attributes in the comment delimiter and they're accessed via the block's attributes object rather than DOM parsing.

---

## Recommendation

**APPROVE WITH SUGGESTIONS** - The codebase is well-implemented and follows WordPress block conventions. Address the warnings before first release for better UX consistency and broader compatibility.
