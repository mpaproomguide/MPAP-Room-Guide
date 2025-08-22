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