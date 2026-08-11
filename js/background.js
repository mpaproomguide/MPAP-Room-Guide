// Ambient background: a slow, zoomed-in 3D waterfall spectrogram of a
// "vox" signal — a harmonic series shaped by three morphing vowel
// formants. Every animated component runs at an integer number of
// cycles per LOOP_SECONDS, so the whole scene loops seamlessly.
// Vanilla canvas, no p5 dependency.

(function () {
    'use strict';

    var LOOP_SECONDS = 60;
    var SPEED = 0.5;   // wall-clock rate: one full loop takes LOOP_SECONDS / SPEED
    var TAU = Math.PI * 2;
    var VIOLET = { r: 87, g: 6, b: 140 };     // --nyu-purple #57068c
    var LAVENDER = { r: 138, g: 43, b: 226 }; // --nyu-light-purple #8a2be2

    function mix(a, b, t) { return Math.round(a + (b - a) * t); }

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (window.innerWidth < 768);

    var BINS = isMobile ? 80 : 140;
    var ROWS = isMobile ? 34 : 58;
    var FPS = 30;
    var FMAX = 42;
    var ROW_DT = 0.35;                      // seconds of history per row

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var canvas, ctx, W, H, DPR;

    function setup() {
        canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText =
            'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
            'z-index:-1;pointer-events:none;' +
            'filter:blur(3px);transform:scale(1.03);';
        document.body.insertBefore(canvas, document.body.firstChild);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);

        if (reduceMotion) {
            render(12.0);                   // one static, composed frame
        } else {
            tick();
        }
    }

    function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        if (reduceMotion) render(12.0);
    }

    /* ----- vox spectrum: deterministic in t, periodic in LOOP_SECONDS ----- */

    function lfo(cycles, phase, t) {
        return Math.sin(TAU * cycles * t / LOOP_SECONDS + phase);
    }

    // fills row[] with the spectrum at absolute time t
    function spectrumRow(row, t) {
        var b;
        for (b = 0; b < BINS; b++) row[b] = 0;

        var F1 = 7 + 3.5 * lfo(2, 0.0, t);
        var F2 = 18 + 8.0 * lfo(3, 1.7, t);
        var F3 = 32 + 5.0 * lfo(1, 3.1, t);

        var k, f, envF, amp, center, from, to, d, g;
        for (k = 1; k <= 18; k++) {
            f = k * 2;
            envF =
                1.00 * Math.exp(-Math.pow((f - F1) / 2.6, 2)) +
                0.70 * Math.exp(-Math.pow((f - F2) / 3.6, 2)) +
                0.42 * Math.exp(-Math.pow((f - F3) / 4.2, 2)) + 0.05;
            amp = (1 / Math.sqrt(k)) * envF *
                  (1 + 0.08 * lfo(4 + (k % 3), k, t));
            if (amp < 0.01) continue;

            // gaussian ridge, only computed near its own peak
            center = f / FMAX * BINS;
            from = Math.max(0, Math.floor(center - 9));
            to = Math.min(BINS - 1, Math.ceil(center + 9));
            for (b = from; b <= to; b++) {
                d = (b + 0.5) / BINS * FMAX - f;
                g = amp * Math.exp(-d * d * 1.4);
                row[b] += g;
            }
        }
        // neighbor-averaging passes melt ridge creases into rolling hills
        var pass, prev, cur;
        for (pass = 0; pass < 2; pass++) {
            prev = row[0];
            for (b = 1; b < BINS - 1; b++) {
                cur = row[b];
                row[b] = 0.25 * prev + 0.5 * cur + 0.25 * row[b + 1];
                prev = cur;
            }
        }
        for (b = 0; b < BINS; b++) row[b] = Math.min(1, row[b] * 0.85);
    }

    /* ----- render: zoomed-in low side angle, gently swaying ----- */

    var rowBuf = new Float32Array(BINS);

    function render(t) {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, W, H);

        var yaw = -0.92 + 0.10 * lfo(1, 0.6, t);
        var pitch = 0.34 + 0.045 * lfo(2, 2.2, t);
        var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        var cosP = Math.cos(pitch), sinP = Math.sin(pitch);

        // oversized and pushed right so the mesh bleeds off the edges,
        // back ridges climbing into the top of the viewport
        var S = Math.max(W, H) * 1.55;
        var cx = W * 0.58, cy = H * 0.46;

        function proj(fx, amp, dz) {
            var X = (fx - 0.5) * 1.9, Y = amp * 0.62, Z = (dz - 0.5) * 2.1;
            var x1 = X * cosY + Z * sinY;
            var z1 = -X * sinY + Z * cosY;
            var y2 = Y * cosP + z1 * sinP;
            var z2 = -Y * sinP + z1 * cosP;
            var p = 3.0 / (3.0 + z2);
            return { x: cx + x1 * p * S * 0.5, y: cy - y2 * p * S * 0.5 };
        }

        var i, b, dz, fade, bl, br, pt;
        for (i = ROWS - 1; i >= 0; i--) {
            spectrumRow(rowBuf, t - i * ROW_DT);
            dz = i / (ROWS - 1);

            bl = proj(0, 0, dz);
            br = proj(1, 0, dz);
            ctx.beginPath();
            ctx.moveTo(bl.x, bl.y);
            for (b = 0; b < BINS; b++) {
                pt = proj(b / (BINS - 1), rowBuf[b], dz);
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.lineTo(br.x, br.y);

            fade = (1 - dz) * (1 - dz);

            // opaque fill occludes the rows behind; a lavender haze that
            // deepens toward the front gives the mesh volume
            ctx.fillStyle = 'rgb(' + mix(245, 238, fade) + ',' +
                            mix(245, 231, fade) + ',' + mix(245, 249, fade) + ')';
            ctx.fill();

            // stroke ramps from airy lavender at the back to full violet
            // up front, with a soft glow on the nearest ridges
            ctx.strokeStyle = 'rgba(' +
                mix(LAVENDER.r, VIOLET.r, fade) + ',' +
                mix(LAVENDER.g, VIOLET.g, fade) + ',' +
                mix(LAVENDER.b, VIOLET.b, fade) + ',' +
                (0.14 + 0.56 * fade).toFixed(3) + ')';
            ctx.lineWidth = 1 + 0.9 * fade;
            if (!isMobile && dz < 0.25) {
                ctx.shadowColor = 'rgba(138,43,226,0.5)';
                ctx.shadowBlur = 7 * (1 - dz * 4);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    /* ----- 30fps loop on the shared seamless clock ----- */

    var last = 0;
    function tick(now) {
        requestAnimationFrame(tick);
        if (now - last < 1000 / FPS) return;
        last = now;
        var t = (now / 1000 * SPEED) % LOOP_SECONDS;
        render(t);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();

// Inject a top-of-page password button on all local pages except index
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Skip on index.html (landing navigator) or pages that opt out
        if (document.body.dataset.hideCredentials === 'true') return;
        var path = (window.location.pathname || '').toLowerCase();
        if (path.endsWith('/index.html') || path === '/' || path === '') {
            return;
        }

        // If a credentials button already exists in the DOM, do not inject another
        if (document.querySelector('.password-btn')) {
            return;
        }

        // Build the link element
        var link = document.createElement('a');
        link.href = 'https://docs.google.com/document/d/1t0-zcBEQpKC0T8B9totgLuMFtEGMDegbU05gRqN8GII/edit?usp=sharing';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'password-btn';
        link.innerHTML = '<i class="fas fa-lock"></i> CLICK HERE FOR LOG IN CREDENTIALS';

        // Preferred placement: Below header on a row with back link (left) and centered password button
        var headerEl = document.querySelector('header');
        var backLink = document.querySelector('.back-link');
        if (headerEl) {
            var row = document.createElement('div');
            row.className = 'back-actions-row';
            if (backLink) {
                headerEl.insertAdjacentElement('afterend', row);
                row.appendChild(backLink);
                row.appendChild(link);
                return;
            } else {
                // no back link; still create row and center password button
                headerEl.insertAdjacentElement('afterend', row);
                row.appendChild(link);
                return;
            }
        }

        // Fallback: center above title if header not found
        var mainTitle = document.querySelector('main h1');
        if (mainTitle) {
            var wrapper = document.createElement('div');
            wrapper.className = 'password-btn-wrapper';
            wrapper.appendChild(link);
            mainTitle.insertAdjacentElement('beforebegin', wrapper);
            return;
        }

        var container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentElement('afterbegin', link);
            return;
        }

        document.body.insertAdjacentElement('afterbegin', link);
    } catch (e) {
        // No-op on errors so it never blocks the page
        console && console.warn && console.warn('Password button inject failed:', e);
    }
});
