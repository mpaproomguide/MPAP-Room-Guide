let waves = [];
const numWaves = 8;
let time = 0;
const baseColor = '#57068c';
let blurAmount = 1;

// Mobile optimization settings
let isMobile = false;
let stepSize, pointSpacing, maxHarmonics, targetFrameRate;

function setup() {
    // Simple mobile detection
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window) || 
               (window.innerWidth < 768);
    
    // Set performance parameters based on device
    if (isMobile) {
        stepSize = 12;        // Bigger steps = less detail but smoother
        pointSpacing = 40;    // Fewer points
        maxHarmonics = 3;     // Limit complexity
        targetFrameRate = 30; // Lower frame rate
        blurAmount = 0.5;     // Less blur
    } else {
        stepSize = 5;         // Original detail
        pointSpacing = 20;    // Original points
        maxHarmonics = 8;     // Full complexity
        targetFrameRate = 60; // Full frame rate
        blurAmount = 1;       // Original blur
    }
    
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    
    // Set frame rate based on device
    frameRate(targetFrameRate);
    
    // Initialize waves with different harmonic properties
    for (let i = 0; i < numWaves; i++) {
        waves.push({
            amplitude: map(i, 0, numWaves-1, height * 0.1, height * 0.3),
            frequency: map(i, 0, numWaves-1, 0.001, 0.005),
            speed: map(i, 0, numWaves-1, 0.5, 2),
            phase: random(TWO_PI),
            harmonic: min(i + 1, maxHarmonics), // Limit harmonics on mobile
            opacity: map(i, 0, numWaves-1, 0.15, 0.05)
        });
    }
}

function draw() {
    clear();
    time += 0.0015;
    
    // Draw each wave
    for (let wave of waves) {
        // Draw the wave pattern
        noFill();
        stroke(color(baseColor + hex(wave.opacity * 255, 2)));
        strokeWeight(isMobile ? 0.8 : 1);
        
        beginShape();
        for (let x = 0; x < width; x += stepSize) {
            // Calculate y position using multiple harmonics
            let y = height/2;
            for (let h = 1; h <= wave.harmonic; h++) {
                y += sin(x * wave.frequency * h + time * wave.speed + wave.phase) * 
                     (wave.amplitude / h);
            }
            vertex(x, y);
        }
        endShape();
        
        // Draw harmonic points (skip on mobile for lowest harmonics)
        if (!isMobile || wave.harmonic >= 3) {
            for (let x = 0; x < width; x += pointSpacing) {
                let y = height/2;
                for (let h = 1; h <= wave.harmonic; h++) {
                    y += sin(x * wave.frequency * h + time * wave.speed + wave.phase) * 
                         (wave.amplitude / h);
                }
                fill(color(baseColor + hex(wave.opacity * 255, 2)));
                noStroke();
                ellipse(x, y, isMobile ? 2 : 3);
            }
        }
    }
    
    // Apply blur effect - disabled for mobile performance
    // filter(BLUR, blurAmount);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // Re-detect mobile status on resize
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window) || 
               (window.innerWidth < 768);
    
    // Update performance settings
    if (isMobile) {
        stepSize = 12;
        pointSpacing = 40;
        maxHarmonics = 3;
        targetFrameRate = 30;
        blurAmount = 0.5;
    } else {
        stepSize = 5;
        pointSpacing = 20;
        maxHarmonics = 8;
        targetFrameRate = 60;
        blurAmount = 1;
    }
    
    frameRate(targetFrameRate);
    
    // Update wave harmonics
    for (let i = 0; i < waves.length; i++) {
        waves[i].harmonic = min(i + 1, maxHarmonics);
    }
} 

// Inject a top-of-page password button on all local pages except index
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Skip on index.html (landing navigator)
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