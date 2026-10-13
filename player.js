document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const playerConsole = document.querySelector('.player-console');
  const ctrlPlay = document.getElementById('ctrl-play');
  const ctrlPrev = document.getElementById('ctrl-prev');
  const ctrlNext = document.getElementById('ctrl-next');
  const ctrlStop = document.getElementById('ctrl-stop');
  const ctrlPlayLabel = document.getElementById('ctrl-play-label');
  const playerStatusText = document.getElementById('player-status-text');
  const playerTimeDisplay = document.getElementById('player-time-display');
  const trackScrubber = document.getElementById('track-scrubber');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');
  const currentTrackName = document.getElementById('current-track-name');
  const currentTrackAlbum = document.getElementById('current-track-album');
  const screenTrackIndicator = document.querySelector('.screen-track-indicator');
  const motionTrackIndicator = document.getElementById('motion-track-indicator');

  // Dynamic Optical Hardware Elements
  const physicalCompactDisc = document.getElementById('physical-compact-disc');
  const laserHead = document.getElementById('laser-head');
  const btnDiscEject = document.getElementById('btn-disc-eject');
  const ejectBtnLabel = document.getElementById('eject-btn-label');
  const cdLidOpenIndicator = document.getElementById('cd-lid-open-indicator');
  const discSpinIndicator = document.getElementById('disc-spin-indicator');
  const espStatusBadge = document.getElementById('esp-status-badge');
  const cdPrintAlbum = document.getElementById('cd-print-album');
  const cdPrintTrack = document.getElementById('cd-print-track');
  const discmanVolume = document.getElementById('discman-volume');
  const volumeValDisplay = document.getElementById('volume-val-display');

  // Viewport Switcher Tabs & Panels
  const viewportTabs = document.querySelectorAll('.viewport-tab');
  const viewportPanels = document.querySelectorAll('.viewport-panel');

  // Disc Vault Jewel Cases
  const jewelCases = document.querySelectorAll('.jewel-case');

  // Real-time Oscilloscope & Visualizer
  const oscilloscopeCanvas = document.getElementById('discman-oscilloscope');
  const oscilloscopeScreen = document.querySelector('.oscilloscope-screen');
  const scopeTelemetryTag = document.querySelector('.scope-telemetry-tag');
  const visBars = document.querySelectorAll('#audio-visualizer .vis-bar');
  const cdSpindleBay = document.getElementById('cd-spindle-bay');
  const playerVisualScreen = document.getElementById('player-visual-screen');

  const phosphorModes = [
    { color: '#8fa85b', name: 'P31 ETHER GREEN' },
    { color: '#38bdf8', name: 'P4 CONCERT BLUE' },
    { color: '#fbbf24', name: 'P12 SOLAR AMBER' }
  ];
  let currentPhosphorIndex = 0;

  // Official 9-track album: 呼吸 (Kokyuu) by Lily Chou-Chou (Lightweight MP3)
  const playlist = [
    {
      title: 'アラベスク',
      sub: 'Arabesque · Track 01',
      duration: 350,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/01%20-%20%E3%82%A2%E3%83%A9%E3%83%99%E3%82%B9%E3%82%AF.mp3'
    },
    {
      title: '愛の実験',
      sub: 'Ai no Jikken · Track 02',
      duration: 327,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/02%20-%20%E6%84%9B%E3%81%AE%E5%AE%9F%E9%A8%93.mp3'
    },
    {
      title: 'エロティック',
      sub: 'Erotic · Track 03',
      duration: 288,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/03%20-%20%E3%82%A8%E3%83%AD%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF.mp3'
    },
    {
      title: '飛行船',
      sub: 'Hikousen · Track 04',
      duration: 187,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/04%20-%20%E9%A3%9B%E8%A1%8C%E8%88%B9.mp3'
    },
    {
      title: '回復する傷',
      sub: 'Kaifuku Suru Kizu · Track 05',
      duration: 183,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/05%20-%20%E5%9B%9E%E5%BE%A9%E3%81%99%E3%82%8B%E5%82%B7.mp3'
    },
    {
      title: '飽和',
      sub: 'Houwa · Track 06',
      duration: 233,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/06%20-%20%E9%A3%BD%E5%92%8C.mp3'
    },
    {
      title: '飛べない翼',
      sub: 'Tobenai Tsubasa · Track 07',
      duration: 288,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/07%20-%20%E9%A3%9B%E3%81%B9%E3%81%AA%E3%81%84%E7%BF%BC.mp3'
    },
    {
      title: '共鳴（空虚な石）',
      sub: 'Kyoumei (Kuukyo na Ishi) · Track 08',
      duration: 263,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/08%20-%20%E5%85%B1%E9%B3%B4%EF%BC%88%E7%A9%BA%E8%99%9A%E3%81%AA%E7%9F%B3%EF%BC%89.mp3'
    },
    {
      title: 'グライド',
      sub: 'Glide · Track 09',
      duration: 220,
      src: './assets/Lily%20Chou-Chou/%E5%91%BC%E5%90%B8%20%282008%29/09%20-%20%E3%82%B0%E3%83%A9%E3%82%A4%E3%83%89.mp3'
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let isLidOpen = false;
  let currentSeconds = 0;
  let autoplayArmed = true;

  // HTML5 Audio Engine & Web Audio API Routing
  const audioElement = new Audio();
  audioElement.preload = 'metadata';
  audioElement.crossOrigin = 'anonymous';
  audioElement.src = playlist[0].src;

  let audioCtx = null;
  let synthMasterGain = null;
  let analyser = null;
  let mediaElementSource = null;
  let oscilloscopeAnimId = null;
  let playerVisible = false;

  const initAudioEngine = () => {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error('Web Audio unavailable');
        audioCtx = new AudioContextClass();
        synthMasterGain = audioCtx.createGain();

        // Connect master volume
        const volVal = discmanVolume ? (parseInt(discmanVolume.value, 10) / 100) : 0.75;
        synthMasterGain.gain.setValueAtTime(volVal, audioCtx.currentTime);
        audioElement.volume = volVal;

        // Real-time FFT Analyser
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;

        try {
          if (!mediaElementSource) {
            mediaElementSource = audioCtx.createMediaElementSource(audioElement);
            mediaElementSource.connect(synthMasterGain);
          }
        } catch (mediaErr) {
          console.warn('MediaElementSource fallback', mediaErr);
        }

        synthMasterGain.connect(analyser);
        analyser.connect(audioCtx.destination);

        startVisualizerLoop();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {
          if (isPlaying) togglePlay();
          playerStatusText.textContent = 'Audio could not start. Try pressing Play again.';
        });
      }
      return true;
    } catch {
      playerStatusText.textContent = 'Audio is unavailable in this browser.';
      return false;
    }
  };

  /* Mechanical Discman Sound Effects (Tactile Hardware Emulation) */
  const playMechanicalSound = (type) => {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      if (type === 'eject') {
        // Mechanical chassis latch release
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(synthMasterGain);
        osc.start(now);
        osc.stop(now + 0.09);

        const snapOsc = audioCtx.createOscillator();
        const snapGain = audioCtx.createGain();
        snapOsc.type = 'square';
        snapOsc.frequency.setValueAtTime(950, now + 0.02);
        snapOsc.frequency.exponentialRampToValueAtTime(280, now + 0.07);
        snapGain.gain.setValueAtTime(0.05, now + 0.02);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        snapOsc.connect(snapGain);
        snapGain.connect(synthMasterGain);
        snapOsc.start(now + 0.02);
        snapOsc.stop(now + 0.08);
      } else if (type === 'close') {
        // Mechanical lid click latch
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.connect(gain);
        gain.connect(synthMasterGain);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'spinup') {
        // Spindle motor frequency ramp
        const motorOsc = audioCtx.createOscillator();
        const motorGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        motorOsc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);

        motorOsc.frequency.setValueAtTime(75, now);
        motorOsc.frequency.exponentialRampToValueAtTime(480, now + 0.32);

        motorGain.gain.setValueAtTime(0.001, now);
        motorGain.gain.linearRampToValueAtTime(0.035, now + 0.08);
        motorGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

        motorOsc.connect(filter);
        filter.connect(motorGain);
        motorGain.connect(synthMasterGain);
        motorOsc.start(now);
        motorOsc.stop(now + 0.33);

        // Laser pickup seek chirp
        const seekOsc = audioCtx.createOscillator();
        const seekGain = audioCtx.createGain();
        seekOsc.type = 'sine';
        seekOsc.frequency.setValueAtTime(1850, now + 0.18);
        seekOsc.frequency.setValueAtTime(2450, now + 0.22);
        seekOsc.frequency.setValueAtTime(1450, now + 0.26);
        seekGain.gain.setValueAtTime(0.015, now + 0.18);
        seekGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);
        seekOsc.connect(seekGain);
        seekGain.connect(synthMasterGain);
        seekOsc.start(now + 0.18);
        seekOsc.stop(now + 0.31);
      } else if (type === 'seek') {
        // High frequency optical tracking click
        const seekOsc = audioCtx.createOscillator();
        const seekGain = audioCtx.createGain();
        seekOsc.type = 'sine';
        seekOsc.frequency.setValueAtTime(2800, now);
        seekOsc.frequency.exponentialRampToValueAtTime(900, now + 0.025);
        seekGain.gain.setValueAtTime(0.025, now);
        seekGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
        seekOsc.connect(seekGain);
        seekGain.connect(synthMasterGain);
        seekOsc.start(now);
        seekOsc.stop(now + 0.03);
      }
    } catch {
      // Audio safeguard
    }
  };

  /* Real-time Oscilloscope Beam & Dynamic EQ Visualizer Loop */
  const startVisualizerLoop = () => {
    if (oscilloscopeAnimId) return;

    const canvas = oscilloscopeCanvas;
    const ctx = canvas ? canvas.getContext('2d') : null;
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    const render = () => {
      oscilloscopeAnimId = null;
      if (!isPlaying || !playerVisible || document.hidden || document.documentElement.classList.contains('motion-paused')) return;
      oscilloscopeAnimId = requestAnimationFrame(render);

      // 1. Live CRT Phosphor Trace on Oscilloscope Canvas
      if (ctx && canvas) {
        const width = canvas.width;
        const height = canvas.height;

        // Persistent phosphor trail decay
        ctx.fillStyle = 'rgba(2, 4, 6, 0.22)';
        ctx.fillRect(0, 0, width, height);

        const activePhosphor = phosphorModes[currentPhosphorIndex];

        if (analyser && isPlaying && !isLidOpen) {
          analyser.getByteTimeDomainData(timeData);

          ctx.lineWidth = 2.0;
          ctx.strokeStyle = activePhosphor.color;
          ctx.shadowColor = activePhosphor.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();

          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = timeData[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // Idling baseline phosphor flutter
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = activePhosphor.color;
          ctx.shadowColor = activePhosphor.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          const midY = height / 2;
          const jitter = (Math.random() - 0.5) * 1.5;
          ctx.moveTo(0, midY + jitter);
          ctx.lineTo(width, midY + jitter);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // 2. Real-Time Dynamic Frequency Visualizer Bars
      if (visBars && visBars.length > 0) {
        const activeColor = phosphorModes[currentPhosphorIndex].color;
        if (analyser && isPlaying && !isLidOpen) {
          analyser.getByteFrequencyData(freqData);
          const barStep = Math.max(1, Math.floor(bufferLength / visBars.length));
          visBars.forEach((bar, idx) => {
            const val = freqData[idx * barStep] || 0;
            const targetScale = Math.max(0.14, val / 255);
            bar.style.transform = `scaleY(${targetScale.toFixed(3)})`;
            bar.style.backgroundColor = activeColor;
            bar.style.boxShadow = `0 0 6px ${activeColor}`;
          });
        } else {
          visBars.forEach(bar => {
            bar.style.transform = 'scaleY(0.14)';
            bar.style.backgroundColor = '';
            bar.style.boxShadow = '';
          });
        }
      }
    };

    render();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updatePlayerDisplay = () => {
    const track = playlist[currentTrackIndex];
    if (currentTrackName) currentTrackName.textContent = track.title;
    if (currentTrackAlbum) currentTrackAlbum.textContent = track.sub;
    jewelCases.forEach((item, index) => {
      const selected = index === currentTrackIndex;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-checked', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    if (isPlaying && playerStatusText) playerStatusText.textContent = `PLAYING: ${track.title}`;
    if (playerTimeDisplay) {
      playerTimeDisplay.textContent = `${formatTime(currentSeconds)} / ${formatTime(track.duration)}`;
    }
    if (trackScrubber) {
      const progressPercent = track.duration > 0 ? (currentSeconds / track.duration) * 100 : 0;
      trackScrubber.value = progressPercent;
      trackScrubber.setAttribute('aria-valuenow', Math.round(progressPercent));
      trackScrubber.setAttribute('aria-valuetext', `${formatTime(currentSeconds)} of ${formatTime(track.duration)}`);
    }
    const indicatorText = `${track.title} · 呼吸 (KOKYUU)`;
    if (screenTrackIndicator) {
      screenTrackIndicator.textContent = indicatorText;
    }
    if (motionTrackIndicator) {
      motionTrackIndicator.textContent = indicatorText;
    }
    if (cdPrintAlbum) cdPrintAlbum.textContent = '呼吸 (KOKYUU)';
    if (cdPrintTrack) cdPrintTrack.textContent = track.title;

    // Laser pickup sled position along radial optical track
    if (laserHead) {
      const progress = track.duration > 0 ? (currentSeconds / track.duration) : 0;
      const sledPos = 16 + (progress * 26);
      laserHead.style.setProperty('--sled-pos', `${sledPos}%`);
    }
  };

  /* HTML5 Audio Events Integration */
  audioElement.addEventListener('timeupdate', () => {
    if (!audioElement.seeking) {
      currentSeconds = Math.floor(audioElement.currentTime);
      updatePlayerDisplay();
    }
  });

  audioElement.addEventListener('loadedmetadata', () => {
    if (audioElement.duration && !isNaN(audioElement.duration)) {
      playlist[currentTrackIndex].duration = Math.floor(audioElement.duration);
    }
    updatePlayerDisplay();
  });

  audioElement.addEventListener('ended', () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrackByIndex(nextIndex, true);
  });

  audioElement.addEventListener('waiting', () => {
    if (playerStatusText && isPlaying) playerStatusText.textContent = 'BUFFERING...';
  });

  audioElement.addEventListener('playing', () => {
    if (playerStatusText && isPlaying) {
      playerStatusText.textContent = `PLAYING: ${playlist[currentTrackIndex].title}`;
    }
  });

  audioElement.addEventListener('error', () => {
    console.warn('Audio playback error for track:', playlist[currentTrackIndex].title);
    if (playerStatusText) playerStatusText.textContent = 'AUDIO ERROR: CHECK FILE';
  });

  const cancelAutoplayArm = () => {
    autoplayArmed = false;
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
  };

  const startPlaybackWithFade = () => {
    if (isLidOpen || isPlaying) return;
    initAudioEngine();
    isPlaying = true;
    startVisualizerLoop();
    if (playerConsole) playerConsole.classList.add('playing');
    if (iconPlay && iconPause) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'inline-block';
    }
    if (ctrlPlayLabel) ctrlPlayLabel.textContent = 'PAUSE';
    if (ctrlPlay) ctrlPlay.setAttribute('aria-label', 'Pause current track');
    if (playerStatusText) playerStatusText.textContent = `PLAYING: ${playlist[currentTrackIndex].title}`;
    if (physicalCompactDisc) physicalCompactDisc.classList.add('spinning');
    if (discSpinIndicator) {
      discSpinIndicator.textContent = '( ( ◎ ) )';
      discSpinIndicator.style.color = 'var(--accent-primary)';
    }
    playMechanicalSound('spinup');

    const targetVol = discmanVolume ? (parseInt(discmanVolume.value, 10) / 100) : 0.75;
    audioElement.volume = 0;
    if (synthMasterGain && audioCtx) {
      synthMasterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      synthMasterGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + 0.4);
    }
    audioElement.play().then(() => {
      let fadeElapsed = 0;
      const fadeStep = 50;
      const fadeInterval = setInterval(() => {
        fadeElapsed += fadeStep;
        const progress = Math.min(1, fadeElapsed / 400);
        audioElement.volume = progress * targetVol;
        if (progress >= 1) clearInterval(fadeInterval);
      }, fadeStep);
    }).catch(err => {
      console.warn('Play failed:', err);
    });
  };

  const handleFirstInteraction = (e) => {
    if (!autoplayArmed || isPlaying || isLidOpen) return;
    if (e && e.target && e.target.closest('#ctrl-play, #ctrl-stop, #btn-disc-eject')) return;
    cancelAutoplayArm();
    startPlaybackWithFade();
  };

  /* Discman Door Open / Eject Toggle */
  const toggleLid = () => {
    cancelAutoplayArm();
    if (!isLidOpen && isPlaying) togglePlay();
    isLidOpen = !isLidOpen;
    playMechanicalSound(isLidOpen ? 'eject' : 'close');

    if (isLidOpen) {
      audioElement.pause();
      if (cdLidOpenIndicator) cdLidOpenIndicator.hidden = false;
      if (physicalCompactDisc) {
        physicalCompactDisc.classList.add('ejected');
        physicalCompactDisc.classList.remove('spinning');
      }
      if (btnDiscEject) btnDiscEject.classList.add('open');
      if (ejectBtnLabel) ejectBtnLabel.textContent = 'CLOSE LID';
      if (playerStatusText) playerStatusText.textContent = 'LID OPEN: MOTOR OFF';
      if (espStatusBadge) espStatusBadge.textContent = 'ESP: DRAINED [□□□□□□□□□□]';
      if (discSpinIndicator) {
        discSpinIndicator.textContent = '( - )';
        discSpinIndicator.style.color = 'var(--accent-warm)';
      }
    } else {
      if (cdLidOpenIndicator) cdLidOpenIndicator.hidden = true;
      if (physicalCompactDisc) {
        physicalCompactDisc.classList.remove('ejected');
      }
      if (btnDiscEject) btnDiscEject.classList.remove('open');
      if (ejectBtnLabel) ejectBtnLabel.textContent = 'OPEN LID';
      if (playerStatusText) playerStatusText.textContent = 'DISC LOADED: READY';
      if (espStatusBadge) espStatusBadge.textContent = 'ESP: 45s BUFFER [■■■■■■■■□□]';
      if (discSpinIndicator) {
        discSpinIndicator.textContent = '( ( ◎ ) )';
        discSpinIndicator.style.color = 'var(--accent-primary)';
      }
      playMechanicalSound('spinup');
    }
  };

  if (btnDiscEject) {
    btnDiscEject.addEventListener('click', toggleLid);
  }

  /* Disc Loading via Jewel Case Rack */
  const loadTrackByIndex = (index, autoPlay = true) => {
    if (index < 0 || index >= playlist.length) return;
    cancelAutoplayArm();
    currentTrackIndex = index;
    currentSeconds = 0;

    const track = playlist[currentTrackIndex];
    audioElement.src = track.src;
    audioElement.currentTime = 0;

    // Update active state in rack
    jewelCases.forEach(jc => {
      const isMatch = parseInt(jc.getAttribute('data-track-index'), 10) === currentTrackIndex;
      jc.classList.toggle('active', isMatch);
      jc.setAttribute('aria-checked', String(isMatch));
      jc.tabIndex = isMatch ? 0 : -1;
    });

    // Auto-close lid if loading a new disc
    if (isLidOpen) {
      toggleLid();
    }

    updatePlayerDisplay();
    playMechanicalSound('spinup');

    // ESP buffer simulation
    if (espStatusBadge) {
      espStatusBadge.textContent = 'ESP: SEEKING [■■■■■□□□□□]';
      setTimeout(() => {
        if (espStatusBadge && !isLidOpen) {
          espStatusBadge.textContent = 'ESP: 45s BUFFER [■■■■■■■■□□]';
        }
      }, 450);
    }

    if (autoPlay) {
      if (!isPlaying) {
        togglePlay();
      } else {
        initAudioEngine();
        audioElement.play().catch(e => console.warn('Play interrupted', e));
      }
    }
  };

  jewelCases.forEach(jc => {
    jc.addEventListener('click', () => {
      const trackIdx = parseInt(jc.getAttribute('data-track-index'), 10);
      loadTrackByIndex(trackIdx, true);
    });
  });

  /* Viewport Switcher Tabs */
  viewportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('aria-controls');

      viewportTabs.forEach(t => {
        const isSelected = t === tab;
        t.classList.toggle('active', isSelected);
        t.setAttribute('aria-selected', String(isSelected));
        t.tabIndex = isSelected ? 0 : -1;
      });

      viewportPanels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
          panel.hidden = false;
        } else {
          panel.classList.remove('active');
          panel.hidden = true;
        }
      });
    });
  });

  /* Play / Pause Toggle */
  const togglePlay = () => {
    cancelAutoplayArm();
    if (!isPlaying && !initAudioEngine()) return;
    if (isLidOpen) {
      toggleLid(); // Close lid first
    }

    isPlaying = !isPlaying;
    startVisualizerLoop();
    if (playerConsole) {
      playerConsole.classList.toggle('playing', isPlaying);
    }
    if (iconPlay && iconPause) {
      iconPlay.style.display = isPlaying ? 'none' : 'inline-block';
      iconPause.style.display = isPlaying ? 'inline-block' : 'none';
    }
    if (ctrlPlayLabel) {
      ctrlPlayLabel.textContent = isPlaying ? 'PAUSE' : 'PLAY';
    }
    if (ctrlPlay) {
      ctrlPlay.setAttribute('aria-label', isPlaying ? 'Pause current track' : 'Play current track');
    }
    if (playerStatusText) {
      playerStatusText.textContent = isPlaying ? `PLAYING: ${playlist[currentTrackIndex].title}` : 'PAUSED';
    }

    // Physical Disc & Icon spinning state
    if (physicalCompactDisc) {
      physicalCompactDisc.classList.toggle('spinning', isPlaying);
    }
    if (discSpinIndicator) {
      discSpinIndicator.textContent = isPlaying ? '( ( ◎ ) )' : '( ◎ )';
      discSpinIndicator.style.color = isPlaying ? 'var(--accent-primary)' : 'var(--text-muted)';
    }

    if (isPlaying) {
      playMechanicalSound('spinup');
      if (!audioElement.src || !audioElement.src.includes(encodeURI(playlist[currentTrackIndex].title))) {
        audioElement.src = playlist[currentTrackIndex].src;
      }
      audioElement.play().catch(e => {
        console.warn('Playback error', e);
      });
    } else {
      audioElement.pause();
    }
  };

  if (ctrlPlay) {
    ctrlPlay.addEventListener('click', togglePlay);
  }

  if (ctrlStop) {
    ctrlStop.addEventListener('click', () => {
      cancelAutoplayArm();
      if (isPlaying) {
        togglePlay();
      }
      audioElement.pause();
      audioElement.currentTime = 0;
      currentSeconds = 0;
      updatePlayerDisplay();
      if (laserHead) laserHead.style.setProperty('--sled-pos', '16%');
      if (physicalCompactDisc) physicalCompactDisc.classList.remove('spinning');
      if (playerStatusText) {
        playerStatusText.textContent = 'DISC STOPPED: READY';
      }
    });
  }

  if (ctrlNext) {
    ctrlNext.addEventListener('click', () => {
      cancelAutoplayArm();
      playMechanicalSound('seek');
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrackByIndex(nextIndex, isPlaying);
    });
  }

  if (ctrlPrev) {
    ctrlPrev.addEventListener('click', () => {
      cancelAutoplayArm();
      playMechanicalSound('seek');
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrackByIndex(prevIndex, isPlaying);
    });
  }

  if (trackScrubber) {
    trackScrubber.addEventListener('input', (e) => {
      const track = playlist[currentTrackIndex];
      const newPercent = parseFloat(e.target.value);
      currentSeconds = Math.floor((newPercent / 100) * track.duration);
      if (audioElement.duration) {
        audioElement.currentTime = (newPercent / 100) * audioElement.duration;
      }
      updatePlayerDisplay();
      playMechanicalSound('seek');
    });
  }

  /* Output Volume Slider */
  if (discmanVolume) {
    discmanVolume.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value, 10);
      if (volumeValDisplay) volumeValDisplay.textContent = `${vol}%`;
      const normalizedVol = vol / 100;
      audioElement.volume = normalizedVol;
      if (synthMasterGain && audioCtx) {
        synthMasterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        synthMasterGain.gain.setValueAtTime(normalizedVol, audioCtx.currentTime);
      }
    });
  }

  /* Direct Tactile Hardware Interactions */
  if (cdSpindleBay) {
    cdSpindleBay.style.cursor = 'pointer';
    cdSpindleBay.setAttribute('title', 'Click to toggle play/pause or insert disc');
    cdSpindleBay.addEventListener('click', (e) => {
      cancelAutoplayArm();
      if (e.target.closest('#btn-disc-eject')) return;
      if (isLidOpen) {
        toggleLid();
      } else {
        togglePlay();
      }
    });
  }

  if (playerVisualScreen) {
    playerVisualScreen.style.cursor = 'pointer';
    playerVisualScreen.setAttribute('title', 'Click CRT monitor to toggle play/pause');
    playerVisualScreen.addEventListener('click', () => {
      cancelAutoplayArm();
      togglePlay();
    });
  }

  if (oscilloscopeScreen) {
    oscilloscopeScreen.style.cursor = 'pointer';
    oscilloscopeScreen.setAttribute('title', 'Click to cycle phosphor trace beam mode');
    oscilloscopeScreen.addEventListener('click', () => {
      currentPhosphorIndex = (currentPhosphorIndex + 1) % phosphorModes.length;
      playMechanicalSound('seek');
      if (scopeTelemetryTag) {
        scopeTelemetryTag.textContent = `LIVE FFT // ${phosphorModes[currentPhosphorIndex].name}`;
      }
    });
  }

  [cdSpindleBay, playerVisualScreen, oscilloscopeScreen].forEach(control => {
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        control.click();
      }
    });
  });

  [viewportTabs, jewelCases].forEach(group => {
    group.forEach((control, index) => control.addEventListener('keydown', event => {
      const offset = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[event.key];
      if (!offset && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? group.length - 1 : (index + offset + group.length) % group.length;
      group[next].focus();
      group[next].click();
    }));
  });

  const refreshVisualizer = () => {
    cancelAnimationFrame(oscilloscopeAnimId);
    oscilloscopeAnimId = null;
    visBars.forEach(bar => { bar.style.transform = 'scaleY(0.14)'; });
    startVisualizerLoop();
  };
  new IntersectionObserver(entries => {
    playerVisible = entries[0].isIntersecting;
    refreshVisualizer();
  }).observe(playerConsole);
  document.addEventListener('visibilitychange', refreshVisualizer);
  document.addEventListener('ether:motionchange', refreshVisualizer);

  updatePlayerDisplay();

  /* Autoplay Engine with First-Interaction Fallback */
  const attemptAutoplay = () => {
    initAudioEngine();
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Direct unmuted autoplay succeeded
        cancelAutoplayArm();
        isPlaying = true;
        startVisualizerLoop();
        if (playerConsole) playerConsole.classList.add('playing');
        if (iconPlay && iconPause) {
          iconPlay.style.display = 'none';
          iconPause.style.display = 'inline-block';
        }
        if (ctrlPlayLabel) ctrlPlayLabel.textContent = 'PAUSE';
        if (ctrlPlay) ctrlPlay.setAttribute('aria-label', 'Pause current track');
        if (playerStatusText) playerStatusText.textContent = `PLAYING: ${playlist[currentTrackIndex].title}`;
        if (physicalCompactDisc) physicalCompactDisc.classList.add('spinning');
        if (discSpinIndicator) {
          discSpinIndicator.textContent = '( ( ◎ ) )';
          discSpinIndicator.style.color = 'var(--accent-primary)';
        }
        playMechanicalSound('spinup');
      }).catch(() => {
        // Browser blocked unmuted autoplay. Arm first-interaction listener across document.
        if (playerStatusText) playerStatusText.textContent = 'READY TO PLAY';
        window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
        window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
      });
    }
  };

  attemptAutoplay();
});
