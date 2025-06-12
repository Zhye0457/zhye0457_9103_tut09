# Generative Artwork with Perlin Noise Animation
Since I chose to use perlin noise to refine my animation, I didn't do any specific interactions.

##  How to Interact
Simply open the HTML file in a browser.
Watch the wheels expand and contract using Perlin noise.
The animation responds over time — no user input required.

##  My Individual Animation Approach
I chose to animate **wheel sizes (radii)** using **Perlin noise**.
This creates a soft, organic pulsing effect across the canvas.

##  Animation Driver: Perlin Noise
I used the `noise()` function in p5.js to animate the radius of each wheel. The radius changes over time based on a Perlin noise value with some exaggeration for visual effect.

##  Unique Visual Feature
My code animates the **radius** of each wheel.
In contrast, other group members may animate color, visibility, or position.
This ensures each submission is distinct and contributes uniquely to the group project.

##  Inspiration Reference
Inspired by the colorful radial symmetry and rhythm found in Pacita Abad’s paintings.
Influenced by generative art using organic motion — e.g., [Tyler Hobbs](https://tylerxhobbs.com/) and p5.js examples with noise-based animation.

## Technical Summary
I added a global `t` variable as a time tracker.
For each frame, I used `noise(t + i * 10)` to get a unique but continuous value per wheel.
Then, I set `radius = originalRadius * (0.7 + n * 1.4)` to exaggerate the fluctuation.
let n = noise(t + i * 10);
wheels[i].radius = wheels[i].originalRadius * (0.7 + n * 1.4);