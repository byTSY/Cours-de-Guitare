/* ============================================
   CHORD DIAGRAM SVG GENERATOR
   Lit les data-attributes et génère un schéma SVG.
   Format :
   <div class="chord-diagram"
        data-voicing="0,2,2,0,0,0"   // de la corde 6 (basse) à la corde 1 (aiguë)
                                      // 'x' = muette, 0 = à vide, 1-N = numéro de frette
        data-fingers="0,2,3,0,0,0">  // 0 = pas de doigt, 1-4 = numéro de doigt
   </div>
   ============================================ */

(function() {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs = {}, text = null) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (text !== null) e.textContent = text;
    return e;
  }

  function renderChord(container) {
    const voicingRaw = (container.dataset.voicing || '').split(',').map(s => s.trim());
    const fingersRaw = (container.dataset.fingers || '').split(',').map(s => s.trim());

    if (voicingRaw.length !== 6) {
      console.warn('chord-diagram needs 6 voicing values', container);
      return;
    }

    // Parse voicing : -1 = muette ('x'), 0 = à vide, 1+ = frette
    const voicing = voicingRaw.map(v => v === 'x' || v === 'X' ? -1 : parseInt(v, 10));
    const fingers = fingersRaw.map(v => parseInt(v, 10) || 0);

    // Determine fret window to display
    const fingeredFrets = voicing.filter(v => v > 0);
    const minFret = fingeredFrets.length ? Math.min(...fingeredFrets) : 1;
    const maxFret = fingeredFrets.length ? Math.max(...fingeredFrets) : 1;

    // If chord fits in frets 1-4, show with nut. Otherwise shift up.
    let baseFret = 1;
    let showNut = true;
    if (maxFret > 4) {
      baseFret = minFret;
      showNut = false;
    }

    // Layout
    const W = 110;
    const H = 132;
    const padTop = 24;
    const padBottom = 12;
    const padLeft = 14;
    const padRight = 14;
    const stringCount = 6;
    const fretCount = 4;
    const stringSpacing = (W - padLeft - padRight) / (stringCount - 1);
    const fretSpacing = (H - padTop - padBottom) / fretCount;

    const svg = el('svg', {
      viewBox: `0 0 ${W} ${H}`,
      width: '110',
      height: '132',
      xmlns: SVG_NS,
      role: 'img',
      'aria-label': 'Schéma d\'accord'
    });

    // Defs for color (use CSS vars via style)
    const styleEl = el('style');
    styleEl.textContent = `
      .nut { stroke: #1F1814; stroke-width: 3; stroke-linecap: round; }
      .fret { stroke: #C8B89B; stroke-width: 0.8; }
      .string { stroke: #6B5E50; stroke-width: 0.8; }
      .dot { fill: #A8431A; }
      .dot-text { fill: #FFFCF5; font-family: 'Manrope', sans-serif; font-size: 9px; font-weight: 700; }
      .marker-x { fill: #6B5E50; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; }
      .marker-o { fill: none; stroke: #6B5E50; stroke-width: 1.2; }
      .fret-label { fill: #6B5E50; font-family: 'Manrope', sans-serif; font-size: 9px; font-weight: 600; }
      .barre { fill: #A8431A; }
    `;
    svg.appendChild(styleEl);

    // Nut or fret label
    if (showNut) {
      svg.appendChild(el('line', {
        x1: padLeft - 1, y1: padTop,
        x2: W - padRight + 1, y2: padTop,
        class: 'nut'
      }));
    } else {
      svg.appendChild(el('text', {
        x: padLeft - 4,
        y: padTop + fretSpacing / 2 + 3,
        'text-anchor': 'end',
        class: 'fret-label'
      }, `${baseFret}fr`));
    }

    // Horizontal frets (lines)
    for (let i = showNut ? 1 : 0; i <= fretCount; i++) {
      svg.appendChild(el('line', {
        x1: padLeft, y1: padTop + i * fretSpacing,
        x2: W - padRight, y2: padTop + i * fretSpacing,
        class: 'fret'
      }));
    }

    // Vertical strings
    for (let i = 0; i < stringCount; i++) {
      const x = padLeft + i * stringSpacing;
      svg.appendChild(el('line', {
        x1: x, y1: padTop,
        x2: x, y2: padTop + fretCount * fretSpacing,
        class: 'string'
      }));
    }

    // Top markers (o or x)
    for (let i = 0; i < stringCount; i++) {
      const x = padLeft + i * stringSpacing;
      const y = padTop - 8;
      if (voicing[i] === -1) {
        svg.appendChild(el('text', {
          x: x, y: y + 3,
          'text-anchor': 'middle',
          class: 'marker-x'
        }, '×'));
      } else if (voicing[i] === 0) {
        svg.appendChild(el('circle', {
          cx: x, cy: y - 1, r: 3.5,
          class: 'marker-o'
        }));
      }
    }

    // Detect barres : same finger# on >=2 strings at same fret
    const barreMap = {};
    for (let i = 0; i < stringCount; i++) {
      if (voicing[i] > 0 && fingers[i] > 0) {
        const key = `${fingers[i]}-${voicing[i]}`;
        if (!barreMap[key]) barreMap[key] = [];
        barreMap[key].push(i);
      }
    }

    // Draw barres first (under dots)
    Object.entries(barreMap).forEach(([key, strings]) => {
      if (strings.length >= 2) {
        const fret = voicing[strings[0]];
        const localFret = fret - baseFret + 1;
        const y = padTop + (localFret - 0.5) * fretSpacing;
        const minS = Math.min(...strings);
        const maxS = Math.max(...strings);
        const x1 = padLeft + minS * stringSpacing;
        const x2 = padLeft + maxS * stringSpacing;
        svg.appendChild(el('rect', {
          x: x1 - 6.5, y: y - 6.5,
          width: x2 - x1 + 13, height: 13,
          rx: 6.5, ry: 6.5,
          class: 'barre'
        }));
      }
    });

    // Draw fingered dots
    for (let i = 0; i < stringCount; i++) {
      if (voicing[i] > 0) {
        const x = padLeft + i * stringSpacing;
        const localFret = voicing[i] - baseFret + 1;
        const y = padTop + (localFret - 0.5) * fretSpacing;

        svg.appendChild(el('circle', {
          cx: x, cy: y, r: 6.5,
          class: 'dot'
        }));
        if (fingers[i] > 0) {
          svg.appendChild(el('text', {
            x: x, y: y + 3.2,
            'text-anchor': 'middle',
            class: 'dot-text'
          }, fingers[i]));
        }
      }
    }

    container.appendChild(svg);
  }

  function init() {
    document.querySelectorAll('.chord-diagram').forEach(renderChord);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
