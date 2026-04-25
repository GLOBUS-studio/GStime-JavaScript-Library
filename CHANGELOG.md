# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0]

### Breaking
- `createHTML(html)` now returns an `Element[]` instead of a single `Element`. Multi-root HTML strings are supported.
- The library is now distributed as UMD (CommonJS / AMD / global). Importing in Node no longer silently no-ops.
- `colorAnimate` now always emits `rgba(...)` to keep alpha consistent.

### Fixed
- `.off(event, handler)` now actually removes handlers attached via `.on()` (previous versions wrapped the user callback in an internal closure, making removal impossible).
- `.on(event, selector, handler)` delegation now uses `target.matches(selector)`, scoped to the bound element. Previously it queried `document.querySelectorAll(selector)` on every event, broke for dynamically inserted elements, and could fire across unrelated containers.
- `.animate()` honours per-property units. `opacity` is now correctly treated as unitless (was emitted as `"0.5px"` and silently rejected by browsers, breaking `fadeIn`/`fadeOut`).
- `.colorAnimate()` no longer collapses all elements to a single key (used `Element` as object key, coerced via `toString()`); now uses a `WeakMap`. Supports named colors and `#RGBA`.
- `.slideUp()` / `.slideDown()` add a fallback timeout, so the callback always fires even when `transitionend` is suppressed (`prefers-reduced-motion`, hidden tabs, `transition: none`). `slideDown` no longer permanently overrides `display`.
- `.remove()` no longer crashes when an element has no parent.
- `GStime.ajax()`:
  - Uses `AbortController` so `timeout` actually aborts the request.
  - Strips non-fetch keys before passing to `fetch()`.
  - Adds `success` and `complete` callbacks; `error` is invoked before `reject`.
  - Default `credentials: "same-origin"`, `mode: "cors"`.
  - `text/javascript` and `text/*` are returned as text; only `xml` content types are parsed via `DOMParser`.

### Added
- `GStime.noConflict()` to restore the previous `window.$`.
- `$.fn` alias of `GStime.prototype` for plugin-style extension.
- `$(function)` is a shorthand for `GStime.ready(function)`.
- TypeScript declarations (`GStime.d.ts`).
- Cross-platform build script (`scripts/build.js`) using `terser` + source map.
- Vitest test suite (jsdom environment).

## [1.4.0]
- Last release of the IIFE/browser-only build. See git history.
