# Design Specification: MP3 Conversion & Autoplay Integration

**Date:** 2026-10-13  
**Status:** Approved by User  
**Target Files:**
- `assets/Lily Chou-Chou/呼吸 (2008)/*.mp3`
- `player.js`
- `index.html`
- `README.md`
- `tests/check_site.py`

---

## 1. Overview & Goals

1. **Lightweight Audio Conversion:**
   The original FLAC files total 196 MB (~25 MB per track), which creates excessive network payload and slow initial buffering for web visitors. We will convert all 9 tracks to high-quality 192 kbps MP3 using `ffmpeg`, reducing the total footprint to ~48 MB (~5 MB per track) while retaining warm audio fidelity and universal web browser compatibility.
2. **Autoplay with Seamless First-Interaction Fallback:**
   Modern desktop and mobile browsers enforce strict autoplay policies that block unmuted sound prior to user interaction. We will implement immediate autoplay on page load, paired with a seamless first-interaction listener fallback (`pointerdown`, `keydown`, `touchstart`) with a 400ms volume fade-in when autoplay is restricted by the browser.

---

## 2. Technical Architecture

### 2.1 Audio Conversion (`ffmpeg`)
- Source: `./assets/Lily Chou-Chou/呼吸 (2008)/*.flac`
- Output: `./assets/Lily Chou-Chou/呼吸 (2008)/*.mp3`
- Conversion command parameters:
  `ffmpeg -v error -i <input.flac> -codec:a libmp3lame -b:a 192k -map_metadata 0 <output.mp3>`
- Replace/remove the heavy `.flac` files so the Git repository and website bundle remain lightweight.

### 2.2 Autoplay & Unlocking Engine (`player.js`)
- On `DOMContentLoaded`, after audio engine initialization:
  - Call `attemptAutoplay()`.
  - Attempt `audioElement.play()`.
  - If resolved:
    - Set state to playing, spin disc, start oscilloscope rendering loop.
  - If rejected (`NotAllowedError` or browser restriction):
    - Display `"CLICK ANYWHERE TO LISTEN"` on the player LCD status display.
    - Attach a one-time global event listener to `window` for `pointerdown`, `keydown`, and `touchstart` with `{ once: true, passive: true }`.
    - When the visitor clicks, taps, or interacts anywhere on the page:
      - Call `audioElement.play()`.
      - Gradually ramp master gain from `0` to target volume over 400ms.
      - Update status to `"PLAYING: アラベスク"`.
- If user explicitly pauses, stops, or ejects the disc lid before interacting, remove the pending autoplay listener.

---

## 3. Copy & Metadata Alignment

- **`index.html`:**
  Update `#listening .listening-detail`:
  `<span class="listening-dot" aria-hidden="true"></span><span>Sound plays automatically as you enter the Ether.</span>`
- **`README.md`:**
  Update interaction notes to reflect the MP3 format and automatic playback on visit.
- **`tests/check_site.py`:**
  Update asset verification to check for all 9 `.mp3` tracks and verify their existence and relative URLs.
