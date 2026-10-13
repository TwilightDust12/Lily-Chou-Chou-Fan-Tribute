# Kokyuu (呼吸) Album Integration & Copyright Disclaimer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the official 9-track album *呼吸 (Kokyuu)* by Lily Chou-Chou into the Discman listening room via progressive HTML5 `<audio>` streaming into Web Audio API, updating the hardware UI, adding comprehensive copyright disclaimers and non-ownership notices, and updating all automated tests.

**Architecture:** Route a progressive HTML5 `<audio>` instance into the Web Audio API using `AudioContext.createMediaElementSource()` so large FLAC files play immediately with low RAM usage while actively driving the real-time FFT visualizer and oscilloscope canvas. Update the jewel case rack to 9 tracks with accessible keyboard navigation, and add explicit non-ownership copyright disclaimers in `#listening`, `.site-footer`, and `README.md`.

**Tech Stack:** Plain HTML5, CSS3, Vanilla ES6+ JavaScript, Web Audio API (`MediaElementAudioSourceNode`, `AnalyserNode`, `GainNode`), Python 3 test runner.

---

### Task 1: Update Static Test Assertions in `tests/check_site.py`

**Files:**
- Modify: `tests/check_site.py`

- [ ] **Step 1: Update test file with new album and disclaimer checks**

Update `tests/check_site.py` to:
1. Verify presence of all 9 jewel cases (`[CD 01]` to `[CD 09]`).
2. Verify all 9 FLAC audio assets exist on disk in `./assets/Lily Chou-Chou/呼吸 (2008)/`.
3. Check for the new copyright disclaimer and non-ownership text in `index.html`.
4. Ensure no regression on portfolio words or forms.

- [ ] **Step 2: Run test to verify it fails on un-updated `index.html`**

Run: `python3 tests/check_site.py`  
Expected: FAIL (assertion error for new copyright disclaimer or 9 jewel cases).

- [ ] **Step 3: Commit test changes**

```bash
git add tests/check_site.py
git commit -m "test: add assertions for Kokyuu album tracks and copyright disclaimer"
```

---

### Task 2: Update HTML Structure and Disclaimers in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update Discman audio copy and disclosure**
Replace the generative chimes disclosure in `#listening .listening-copy` with the official album disclosure and copyright attribution.

- [ ] **Step 2: Update Compact Disc Silk Screen and Jewel Case Rack**
In `#listening`:
- Change `#cd-print-album` text to `呼吸 (KOKYUU)`.
- Change `#cd-print-track` text to `01. アラベスク`.
- Change `.rack-header` text: `.rack-title` to `ALBUM: 呼吸 (KOKYUU)` and `.rack-hint` to `9 Tracks · Lily Chou-Chou`.
- Update `.rack-grid` to contain 9 `<button type="button" class="jewel-case" data-track-index="...">` elements for tracks 0 to 8:
  - CD 01: アラベスク (Arabesque)
  - CD 02: 愛の実験 (Ai no Jikken)
  - CD 03: エロティック (Erotic)
  - CD 04: 飛行船 (Hikousen)
  - CD 05: 回復する傷 (Kaifuku Suru Kizu)
  - CD 06: 飽和 (Houwa)
  - CD 07: 飛べない翼 (Tobenai Tsubasa)
  - CD 08: 共鳴（空虚な石） (Kyoumei)
  - CD 09: グライド (Glide)

- [ ] **Step 3: Add Explicit Copyright Notice and Non-Ownership Disclaimer to Footer**
In `.site-footer`:
- Add a dedicated `<div class="footer-disclaimer">` containing:
  - Strong heading: `Disclaimer & Copyright Notice`
  - Explicit statement: "All music, compositions, and sound recordings from the album 呼吸 (Kokyuu), as well as film imagery, characters, trademarks, and titles from All About Lily Chou-Chou (リリイ・シュシュのすべて), belong entirely to their respective original copyright holders: Takeshi Kobayashi, Salyu, OORONG-SHA, Avex Inc., Rockwell Eyes, and Shunji Iwai."
  - Non-ownership notice: "The author of this website does not own, nor claim any ownership over, any of the music, audio recordings, images, or intellectual properties featured on this site. This website is a strictly non-commercial, personal fan tribute created exclusively for artistic appreciation and community reflection. No copyright infringement is intended."

- [ ] **Step 4: Run test to check progress**

Run: `python3 tests/check_site.py`  
Expected: PASS or advancing to player bindings.

- [ ] **Step 5: Commit HTML changes**

```bash
git add index.html
git commit -m "feat(html): add 9-track Kokyuu rack, silk-screen labels, and copyright disclaimer"
```

---

### Task 3: Responsive Styles in `player.css` and `style.css`

**Files:**
- Modify: `player.css`
- Modify: `style.css`

- [ ] **Step 1: Style the 9-case rack grid**
In `player.css` and `style.css`:
- Configure `.rack-grid` to display 3 columns on desktop (`grid-template-columns: repeat(3, 1fr)`) or 3 columns with clean spacing.
- On tablet / mobile (`max-width: 760px`): ensure buttons remain legible with two or three column responsive flow (`repeat(3, minmax(0, 1fr))` or `repeat(2, minmax(0, 1fr))`), minimum 44px touch target, and Japanese font support.

- [ ] **Step 2: Style footer disclaimer**
In `style.css`:
- Add `.footer-disclaimer` styling: muted, bordered card matching the ethereal palette (`border: 1px solid var(--line)`, subtle padding, small typography).

- [ ] **Step 3: Verify visual structure and linting**

Run: `python3 tests/check_site.py`  
Expected: PASS.

- [ ] **Step 4: Commit style updates**

```bash
git add player.css style.css
git commit -m "style: update jewel case rack grid for 9 tracks and style legal disclaimer"
```

---

### Task 4: Implement HTML5 Audio Streaming & Web Audio Engine in `player.js`

**Files:**
- Modify: `player.js`

- [ ] **Step 1: Define the 9-track playlist with asset paths and metadata**
Update the `playlist` array in `player.js` with all 9 FLAC tracks:
```javascript
const playlist = [
  {
    title: 'アラベスク',
    romaji: 'Arabesque',
    duration: 350,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/01%20-%20%E3%82%A2%E3%83%A9%E3%83%99%E3%82%B9%E3%82%AF.flac'
  },
  {
    title: '愛の実験',
    romaji: 'Ai no Jikken',
    duration: 327,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/02%20-%20%E6%84%9B%E3%81%AE%E5%AE%9F%E9%A8%93.flac'
  },
  {
    title: 'エロティック',
    romaji: 'Erotic',
    duration: 288,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/03%20-%20%E3%82%A1%E3%83%AD%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF.flac'
  },
  {
    title: '飛行船',
    romaji: 'Hikousen',
    duration: 187,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/04%20-%20%E9%A3%9B%E8%A1%8C%E8%88%B9.flac'
  },
  {
    title: '回復する傷',
    romaji: 'Kaifuku Suru Kizu',
    duration: 183,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/05%20-%20%E5%9B%9E%E5%BE%A9%E3%81%99%E3%82%8B%E5%82%B7.flac'
  },
  {
    title: '飽和',
    romaji: 'Houwa',
    duration: 233,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/06%20-%20%E9%A3%BD%E5%92%8C.flac'
  },
  {
    title: '飛べない翼',
    romaji: 'Tobenai Tsubasa',
    duration: 288,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/07%20-%20%E9%A3%9B%E3%81%B9%E3%81%AA%E3%81%84%E7%BF%BC.flac'
  },
  {
    title: '共鳴（空虚な石）',
    romaji: 'Kyoumei (Kuukyo na Ishi)',
    duration: 263,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/08%20-%20%E5%85%B1%E9%B3%B4%EF%BC%88%E7%A9%BA%E8%99%9A%E3%81%AA%E7%9F%B3%EF%BC%89.flac'
  },
  {
    title: 'グライド',
    romaji: 'Glide',
    duration: 220,
    src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20(2008)/09%20-%20%E3%82%B0%E3%83%A9%E3%82%A4%E3%83%89.flac'
  }
];
```

- [ ] **Step 2: Initialize HTML5 `<audio>` and MediaElementAudioSourceNode**
- Create an internal `audioElement = new Audio()`.
- On user play interaction, initialize `AudioContext` and connect `audioCtx.createMediaElementSource(audioElement)` to `analyser` ➔ `synthMasterGain` ➔ `audioCtx.destination`.
- Wire `audioElement` event listeners:
  - `timeupdate`: update current playback seconds and scrubber.
  - `loadedmetadata`: update duration and display.
  - `ended`: automatically advance to next track (`(currentTrackIndex + 1) % playlist.length`).
  - `waiting`: update status to `BUFFERING...`.
  - `playing`: update status to `PLAYING`.

- [ ] **Step 3: Update player controls and display**
- Update `loadTrackByIndex(index, autoPlay)`: sets `audioElement.src`, updates silk screen disc print, updates LCD titles, resets scrubber.
- Update `togglePlay()`: plays/pauses `audioElement`, updates play/pause icons and laser head animation.
- Update `toggleLid()`: stops playback when lid is opened.
- Update `discmanVolume` handler to update both `synthMasterGain` and `audioElement.volume`.
- Update `trackScrubber` seeking to update `audioElement.currentTime`.

- [ ] **Step 4: Verify syntax and functionality**

Run: `node --check player.js`  
Expected: Clean exit code 0.

- [ ] **Step 5: Commit player engine updates**

```bash
git add player.js
git commit -m "feat(player): pipe Kokyuu FLAC stream to Web Audio FFT analyser and oscilloscope"
```

---

### Task 5: Synchronize Documentation in `README.md`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README description, audio details, and copyright disclaimer**
- Clarify that the Discman listening room streams the 9 tracks of *呼吸 (Kokyuu)* by Lily Chou-Chou.
- Add an explicit **Disclaimer & Copyright Notice** section matching the website footer.

- [ ] **Step 2: Commit documentation changes**

```bash
git add README.md
git commit -m "docs: update README with Kokyuu tracklist and legal disclaimer"
```

---

### Task 6: Full Verification and Regression Testing

**Files:**
- Test all modified files

- [ ] **Step 1: Run Python static validation suite**

Run: `python3 tests/check_site.py`  
Expected: `PASS: ... unique IDs, ... linked targets, ... local assets, and player bindings`.

- [ ] **Step 2: Run Node.js syntax checks**

Run: `node --check script.js && node --check player.js`  
Expected: Clean exit code 0.

- [ ] **Step 3: Verify local HTTP server audio playback headers**

Run a brief Python test command to verify that all 9 audio files exist, have appropriate read permissions, and can be resolved relatively.

- [ ] **Step 4: Final Git Status Check**

Run: `git status`  
Confirm clean working tree or staged commits ready for push.
