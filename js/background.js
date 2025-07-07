let waves = [];
const numWaves = 8;
let time = 0;
const baseColor = '#57068c';
let blurAmount = 1; // Reduced blur amount for a more balanced effect

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    
    // Initialize waves with different harmonic properties
    for (let i = 0; i < numWaves; i++) {
        waves.push({
            amplitude: map(i, 0, numWaves-1, height * 0.1, height * 0.3),
            frequency: map(i, 0, numWaves-1, 0.001, 0.005),
            speed: map(i, 0, numWaves-1, 0.5, 2),
            phase: random(TWO_PI),
            harmonic: i + 1,
            opacity: map(i, 0, numWaves-1, 0.15, 0.05)
        });
    }
}

function draw() {
    clear();
    time += 0.001; // Slow animation
    
    // Draw each wave
    for (let wave of waves) {
        // Draw the wave pattern
        noFill();
        stroke(color(baseColor + hex(wave.opacity * 255, 2)));
        strokeWeight(1);
        
        beginShape();
        for (let x = 0; x < width; x += 5) {
            // Calculate y position using multiple harmonics
            let y = height/2;
            for (let h = 1; h <= wave.harmonic; h++) {
                y += sin(x * wave.frequency * h + time * wave.speed + wave.phase) * 
                     (wave.amplitude / h);
            }
            vertex(x, y);
        }
        endShape();
        
        // Draw harmonic points
        for (let x = 0; x < width; x += 20) {
            let y = height/2;
            for (let h = 1; h <= wave.harmonic; h++) {
                y += sin(x * wave.frequency * h + time * wave.speed + wave.phase) * 
                     (wave.amplitude / h);
            }
            fill(color(baseColor + hex(wave.opacity * 255, 2)));
            noStroke();
            ellipse(x, y, 3);
        }
    }
    // Apply blur effect
    filter(BLUR, blurAmount);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Redraw static background on resize
    waves = [];
    setup();
} 