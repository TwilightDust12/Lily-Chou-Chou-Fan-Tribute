# Design Specification: Kokyuu (呼吸) Album Integration & Copyright Disclaimer

**Date:** 2026-10-13  
**Status:** Approved by User  
**Target Files:**
- `index.html`
- `player.js`
- `player.css`
- `style.css`
- `README.md`
- `tests/check_site.py`

---

## 1. Executive Summary & Goals

The user has added the official FLAC audio files for Lily Chou-Chou's album **呼吸 (Kokyuu / Breathe)** (2001/2008) into `assets/Lily Chou-Chou/呼吸 (2008)/`.

The goals of this project are:
1. **Audio Integration:** Implement the full 9-track *呼吸 (Kokyuu)* album directly inside the Discman listening room, replacing the procedural ambient synthesizer as the primary sound source.
2. **Web Audio Fidelity:** Retain the live phosphor CRT oscilloscope canvas and equalizer visualizer bars by piping the `<audio>` stream into the existing `AudioContext` via `MediaElementAudioSourceNode`.
3. **Hardware UI Update:** Expand the Discman jewel case selector rack and disc screen from 5 ambient presets to 9 official album tracks with tactile controls and responsive layout.
4. **Comprehensive Copyright Notice & Disclaimer:** Add explicit copyright notices and non-ownership disclaimers across the site UI (`#listening` section and footer), `README.md`, and automated test assertions, clearly acknowledging that all music, compositions, and film assets belong to their respective copyright owners (Takeshi Kobayashi, Salyu, Avex Inc. / OORONG-SHA, Rockwell Eyes, and Shunji Iwai).

---

## 2. Audio Pipeline & Technical Architecture

### 2.1 Progressive Streaming via HTML5 `<audio>` & Web Audio API
- Rather than loading massive FLAC files into memory with `fetch()` + `decodeAudioData()` (which would require downloading 15–30 MB before playback begins and consume excessive RAM), we use an HTML5 `<audio>` element (or `new Audio()`).
- The audio element stream is piped into Web Audio via `audioCtx.createMediaElementSource(audioElement)`.
- **Node Routing:**
  `audioElement` ➔ `MediaElementAudioSourceNode` ➔ `analyser` (FFT analyser) ➔ `synthMasterGain` (Volume Gain) ➔ `audioCtx.destination`
- **Fallback / Safety:** If `createMediaElementSource` fails (e.g., file protocol restrictions without a local HTTP server), playback falls back gracefully to standard audio output without breaking UI transport controls.
- **Progressive Buffering & Seeking:** Native `<audio>` events (`timeupdate`, `loadedmetadata`, `ended`, `error`, `waiting`, `playing`) drive track scrubbers, track duration counters, and automatic advancement to the next track when a song finishes.

### 2.2 Asset Path Resolution
- Asset directory: `./assets/Lily Chou-Chou/呼吸 (2008)/`
- Relative paths are URL-encoded for browser compatibility:
  - `01 - アラベスク.flac` ➔ `./assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/01%20-%20%E3%82%A2%E3%83%A9%E3%83%99%E3%82%B9%E3%82%AF.flac`
  - (and corresponding paths for all 9 tracks).

---

## 3. Track Listing & Metadata

The 9 tracks with measured durations and verified filenames:

| Track # | Disc Spine | Title (Japanese) | Title (Romanized) | Duration | File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `[CD 01]` | アラベスク | Arabesque | 05:50 (350s) | `01 - アラベスク.flac` |
| 2 | `[CD 02]` | 愛の実験 | Ai no Jikken | 05:26 (327s) | `02 - 愛の実験.flac` |
| 3 | `[CD 03]` | エロティック | Erotic | 04:47 (288s) | `03 - エロティック.flac` |
| 4 | `[CD 04]` | 飛行船 | Hikousen | 03:06 (187s) | `04 - 飛行船.flac` |
| 5 | `[CD 05]` | 回復する傷 | Kaifuku Suru Kizu | 03:03 (183s) | `05 - 回復する傷.flac` |
| 6 | `[CD 06]` | 飽和 | Houwa | 03:52 (233s) | `06 - 飽和.flac` |
| 7 | `[CD 07]` | 飛べない翼 | Tobenai Tsubasa | 04:47 (288s) | `07 - 飛べない翼.flac` |
| 8 | `[CD 08]` | 共鳴（空虚な石） | Kyoumei (Kuukyo na Ishi) | 04:22 (263s) | `08 - 共鳴（空虚な石）.flac` |
| 9 | `[CD 09]` | グライド | Glide | 03:40 (220s) | `09 - グライド.flac` |

---

## 4. UI/UX Specifications

### 4.1 Discman Listening Room (`#listening`)
- **Jewel Case Rack (`.cd-jewel-case-rack`):**
  - Updated from 5 cases to 9 cases.
  - Header text updated to:
    - Title: `ALBUM: 呼吸 (KOKYUU)`
    - Hint: `9 Tracks · Shunji Iwai & Takeshi Kobayashi`
  - Each jewel case button contains spine `[CD 01]`–`[CD 09]` and track name in Japanese with subtitle/romanization.
- **Physical Disc Silk Screen:**
  - Album label: `呼吸 (KOKYUU)`
  - Active track label: updates to match active track title.
- **LCD Display & Transport:**
  - Status display: shows `READY TO PLAY`, `NOW PLAYING`, `PAUSED`, or `BUFFERING`.
  - Timestamp display: live `MM:SS / MM:SS` updated via `timeupdate` and `loadedmetadata`.
  - Scrubber: smooth seeking mapped to `audioElement.currentTime`.
  - Next/Prev buttons: cycle through tracks 0–8 with mechanical sound clicks.
  - Eject / Lid Open: pausing playback if lid is opened, displaying `LID OPEN // INSERT COMPACT DISC`.
- **Field & Oscilloscope Viewports:**
  - CRT Field View: track indicator updates with active track name and album credit.
  - Oscilloscope View: renders real-time FFT waveform generated from the audio stream.

### 4.2 Responsive Layout Updates (`player.css` / `style.css`)
- `.rack-grid` updated to accommodate 9 buttons:
  - Desktop (>1024px): 3 columns or 5+4 responsive layout (`grid-template-columns: repeat(3, 1fr)` or dynamic auto-fill).
  - Tablet (640px–1024px): 3 columns (`repeat(3, 1fr)`).
  - Mobile (<640px): 3 columns or 2 columns with touch-friendly targets (minimum 44px height).

---

## 5. Copyright Notice & Legal Disclaimer

### 5.1 Listening Room Disclosure (`#listening .listening-copy`)
Text update:
> *"This Discman streams audio from the album 呼吸 (Kokyuu) by Lily Chou-Chou (composed by Takeshi Kobayashi, vocals by Salyu). All master recordings and musical works are the property of their respective copyright holders (Takeshi Kobayashi, Salyu, OORONG-SHA / avex trax). This site is an independent, non-commercial fan tribute and claims no ownership over any music or media."*

### 5.2 Footer Disclaimer (`.site-footer`)
Enhanced dedicated disclaimer banner:
> **Disclaimer & Copyright Notice:**
> *"All music, compositions, and sound recordings from the album 呼吸 (Kokyuu), as well as film imagery, characters, trademarks, and titles from All About Lily Chou-Chou (リリイ・シュシュのすべて), belong entirely to their respective original copyright holders: Takeshi Kobayashi, Salyu, OORONG-SHA, Avex Inc., Rockwell Eyes, and Shunji Iwai.*
> 
> *The creator of this website does not own, nor claim any ownership over, any of the music, audio recordings, images, or intellectual properties featured on this site. This website is a strictly non-commercial, personal fan tribute created exclusively for artistic appreciation and community reflection. No copyright infringement is intended."*

### 5.3 Documentation & README (`README.md`)
Synchronize the README description and credits section with the explicit disclaimer and album details.

---

## 6. Testing & Quality Assurance

1. **Automated Static Checks (`tests/check_site.py`):**
   - Verify that all 9 FLAC audio asset paths exist and are relative (`./assets/...`).
   - Verify that all 9 jewel cases have unique IDs/bindings and proper `role="radio"` / `aria-checked` states.
   - Assert presence of the non-ownership copyright disclaimer strings.
   - Assert zero duplicate IDs and that all `aria-controls` targets exist.
2. **Syntax Verification:**
   - `node --check script.js`
   - `node --check player.js`
3. **Manual / Runtime Verification:**
   - Verify audio element instantiation and user gesture unlocking.
   - Verify volume control, track scrubber seeking, and track finish auto-advance.
   - Verify oscilloscope and visualizer animations respond to audio playback.
   - Verify responsive behavior on simulated mobile and desktop viewports.
