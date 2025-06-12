let wheels = [];      // Array to store all wheel objects
let connectors = [];  // Array to store all connector objects between wheels
let t = 0;            // Time tracker for Perlin noise animation

// Color palettes inspired by Pacita Abad's vibrant artwork
const colorPalettes = [
  ['#45206A', '#FFD700', '#FF8C00', '#B0E0E6', '#8A2BE2'],
  ['#D90429', '#F4D35E', '#F7B267', '#0A796F', '#2E4057'],
  ['#A34A2A', '#F2AF29', '#E0A890', '#3E8914', '#D4327C'],
  ['#004C6D', '#7FC2BF', '#FFC94F', '#D83A56', '#5C88BF'],
  ['#C11F68', '#F9E795', '#F5EEF8', '#2ECC71', '#8E44AD'],
  ['#006D77', '#FF8C00', '#E29578', '#83C5BE', '#D64045'],
];

const backgroundColor = '#2A363B';  // Dark background for contrast

function setup() {
  createCanvas(windowWidth, windowHeight);  // Create full-window canvas
  angleMode(RADIANS);                       // Use radians for angle calculations
  initializeArtwork();                      // Generate the initial wheels and connectors
}

function draw() {
  background(backgroundColor);  // Clear and repaint background

  // Animate each wheel's radius using Perlin noise for organic fluctuation
  for (let i = 0; i < wheels.length; i++) {
    let n = noise(t + i * 10); // Offset noise input per wheel to avoid synchronization
    wheels[i].radius = wheels[i].originalRadius * (0.7 + n * 1.4); // Apply noise-based scaling
  }

  // Draw all connectors first (so they appear behind the wheels)
  for (const conn of connectors) {
    conn.display();
  }

  // Then draw all wheels on top
  for (const wheel of wheels) {
    wheel.display();
  }

  t += 0.01;  // Increment Perlin noise time
}

function initializeArtwork() {
  wheels = [];
  connectors = [];

  const numWheels = 25;                    // Total number of wheels to generate
  const minRadius = width * 0.04;          // Minimum radius for a wheel
  const maxRadius = width * 0.12;          // Maximum radius for a wheel
  const maxAttempts = 5000;                // Safety cap to prevent infinite loops
  let currentAttempts = 0;

  while (wheels.length < numWheels && currentAttempts < maxAttempts) {
    let candidateRadius = random(minRadius, maxRadius);
    let candidateX = random(candidateRadius, width - candidateRadius);
    let candidateY = random(candidateRadius, height - candidateRadius);

    let isOverlappingTooMuch = false;
    let hasNearbyWheel = false;

    for (let other of wheels) {
      let d = dist(candidateX, candidateY, other.x, other.y);
      let combinedRadius = candidateRadius + other.radius;
      const overlapThreshold = min(candidateRadius, other.radius) * 0.4;
      if (d < combinedRadius - overlapThreshold) {
        isOverlappingTooMuch = true;
        break;
      }
      if (d < combinedRadius * 1.5) {
        hasNearbyWheel = true;
      }
    }

    if (wheels.length === 0) {
      hasNearbyWheel = true;
    }

    if (!isOverlappingTooMuch && hasNearbyWheel) {
      let selectedPalette = random(colorPalettes);

      if (wheels.length > 0 && selectedPalette === wheels[wheels.length - 1].colors) {
        selectedPalette = random(colorPalettes.filter(p => p !== selectedPalette));
      }

      let wheel = new Wheel(candidateX, candidateY, candidateRadius, selectedPalette);
      wheel.originalRadius = candidateRadius;
      wheels.push(wheel);
    }

    currentAttempts++;
  }

  for (let i = 0; i < wheels.length; i++) {
    for (let j = i + 1; j < wheels.length; j++) {
      let w1 = wheels[i];
      let w2 = wheels[j];
      let d = dist(w1.x, w1.y, w2.x, w2.y);
      if (d < (w1.radius + w2.radius) * 1.3) {
        connectors.push(new Connector(w1, w2, random(colorPalettes)[0]));
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeArtwork();
}