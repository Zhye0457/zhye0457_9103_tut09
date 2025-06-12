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
// Class representing a decorated wheel
class Wheel {
  constructor(x, y, radius, palette) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.originalRadius = radius;
    this.colors = palette;
    this.stemAngle = random(TWO_PI); // Angle for decorative stem
  }

  display() {
    push();
    translate(this.x, this.y);
    this.drawBaseCircle();
    this.drawOuterDots();
    this.drawSpokes();
    this.drawInnerCircles();
    this.drawStem();
    pop();
  }

  drawBaseCircle() {
    noStroke();
    fill(this.colors[0]);
    circle(0, 0, this.radius * 2);
  }

  drawOuterDots() {
    const dotCount = 40;
    const dotRadius = this.radius * 0.9;
    const dotSize = this.radius * 0.08;
    fill(this.colors[1]);
    noStroke();
    for (let i = 0; i < dotCount; i++) {
      const angle = map(i, 0, dotCount, 0, TWO_PI);
      const dx = cos(angle) * dotRadius;
      const dy = sin(angle) * dotRadius;
      circle(dx, dy, dotSize);
    }
  }

  drawSpokes() {
    const spokeCount = 24;
    const innerRadius = this.radius * 0.55;
    const outerRadius = this.radius * 0.8;
    stroke(this.colors[3]);
    strokeWeight(this.radius * 0.03);
    for (let i = 0; i < spokeCount; i++) {
      const angle = map(i, 0, spokeCount, 0, TWO_PI);
      const x1 = cos(angle) * innerRadius;
      const y1 = sin(angle) * innerRadius;
      const x2 = cos(angle) * outerRadius;
      const y2 = sin(angle) * outerRadius;
      line(x1, y1, x2, y2);
    }
  }

  drawInnerCircles() {
    noStroke();
    fill(this.colors[2]);
    circle(0, 0, this.radius * 0.6);

    fill(this.colors[3]);
    const innerDotCount = 20;
    const innerDotRadius = this.radius * 0.4;
    const innerDotSize = this.radius * 0.06;
    for (let i = 0; i < innerDotCount; i++) {
      const angle = map(i, 0, innerDotCount, 0, TWO_PI);
      const dx = cos(angle) * innerDotRadius;
      const dy = sin(angle) * innerDotRadius;
      circle(dx, dy, innerDotSize);
    }

    fill(this.colors[4]);
    circle(0, 0, this.radius * 0.3);

    fill(this.colors[0]);
    circle(0, 0, this.radius * 0.15);
  }

  drawStem() {
    stroke(this.colors[1]);
    strokeWeight(this.radius * 0.04);
    noFill();
    const startX = cos(this.stemAngle) * (this.radius * 0.075);
    const startY = sin(this.stemAngle) * (this.radius * 0.075);
    const endX = cos(this.stemAngle) * (this.radius * 0.5);
    const endY = sin(this.stemAngle) * (this.radius * 0.5);
    const controlX = cos(this.stemAngle + 0.5) * (this.radius * 0.4);
    const controlY = sin(this.stemAngle + 0.5) * (this.radius * 0.4);
    beginShape();
    vertex(startX, startY);
    quadraticVertex(controlX, controlY, endX, endY);
    endShape();
    noStroke();
    fill(this.colors[1]);
    circle(endX, endY, this.radius * 0.08);
  }
}
// Class for visual connectors between wheels
class Connector {
  constructor(wheel1, wheel2, connectColor) {
    this.w1 = wheel1;
    this.w2 = wheel2;
    this.color = connectColor;
    this.angle = atan2(this.w2.y - this.w1.y, this.w2.x - this.w1.x);

    this.startPoint = createVector(
      this.w1.x + cos(this.angle) * this.w1.radius,
      this.w1.y + sin(this.angle) * this.w1.radius
    );
    this.endPoint = createVector(
      this.w2.x + cos(this.angle + PI) * this.w2.radius,
      this.w2.y + sin(this.angle + PI) * this.w2.radius
    );
  }

  display() {
    stroke(this.color);
    strokeWeight(5);
    noFill();
    line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    let midX = (this.startPoint.x + this.endPoint.x) / 2;
    let midY = (this.startPoint.y + this.endPoint.y) / 2;
    let distBetweenWheels = dist(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    const linkSize = 10;
    const numLinks = floor(distBetweenWheels / (linkSize * 1.5));
    if (numLinks > 0) {
      for (let i = 0; i <= numLinks; i++) {
        let lerpAmount = map(i, 0, numLinks, 0, 1);
        let linkX = lerp(this.startPoint.x, this.endPoint.x, lerpAmount);
        let linkY = lerp(this.startPoint.y, this.endPoint.y, lerpAmount);
        fill(255, 200, 100);
        stroke(this.color);
        strokeWeight(1);
        circle(linkX, linkY, linkSize);
        fill(0);
        noStroke();
        circle(linkX, linkY, linkSize * 0.4);
      }
    }

    fill(255);
    stroke(this.color);
    strokeWeight(3);
    circle(midX, midY, 20);

    fill(this.color);
    noStroke();
    circle(midX, midY, 10);

    fill(255, 200, 100);
    const numSmallDots = 8;
    const smallDotRadius = 15;
    const smallDotSize = 4;
    for (let i = 0; i < numSmallDots; i++) {
      let angle = map(i, 0, numSmallDots, 0, TWO_PI);
      let dx = midX + cos(angle) * smallDotRadius;
      let dy = midY + sin(angle) * smallDotRadius;
      circle(dx, dy, smallDotSize);
    }
  }
}