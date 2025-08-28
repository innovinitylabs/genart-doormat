// Generative Doormat Art - P5.js
// Inspired by traditional woven doormats with stripes and fringe

let doormatWidth = 600;
let doormatHeight = 400;
let fringeLength = 30;
let currentSeed = 42;

// Color palettes inspired by traditional doormats - more muted and realistic
const colorPalettes = [
    // Muted Earthy palette
    {
        name: "Muted Earthy",
        colors: [
            '#8B7355', // Muted Brown
            '#A0522D', // Sienna
            '#CD853F', // Peru
            '#DEB887', // Burlywood
            '#D2B48C', // Tan
            '#BC8F8F', // Rosy Brown
            '#F5DEB3', // Wheat
            '#F4E4BC'  // Cream
        ]
    },
    // Muted Traditional palette
    {
        name: "Muted Traditional",
        colors: [
            '#8B2635', // Muted Red
            '#556B2F', // Dark Olive Green
            '#4B5D6B', // Muted Blue
            '#B8860B', // Dark Goldenrod
            '#654321', // Dark Brown
            '#2F4F2F', // Dark Forest Green
            '#2F4F4F', // Dark Slate Gray
            '#F5F5DC'  // Beige
        ]
    },
    // Muted Ocean palette
    {
        name: "Muted Ocean",
        colors: [
            '#5F7A7A', // Muted Teal
            '#6B8E8E', // Dark Sea Green
            '#4A6B7A', // Muted Blue
            '#5F7A6B', // Muted Green
            '#6B6B7A', // Muted Gray-Blue
            '#4A5F6B', // Dark Slate
            '#E8F0F0', // Light Gray
            '#D4E6E6'  // Very Light Teal
        ]
    },
    // Muted Sunset palette
    {
        name: "Muted Sunset",
        colors: [
            '#8B4513', // Saddle Brown
            '#A0522D', // Sienna
            '#CD853F', // Peru
            '#D2691E', // Chocolate
            '#8B0000', // Dark Red
            '#A0522D', // Sienna
            '#F5DEB3', // Wheat
            '#F4E4BC'  // Cream
        ]
    }
];

let selectedPalette;
let stripeData = [];

function setup() {
    let canvas = createCanvas(doormatWidth + (fringeLength * 2), doormatHeight + (fringeLength * 2));
    canvas.parent('canvas-container');
    noLoop();
}

function generateDoormat(seed) {
    currentSeed = seed;
    randomSeed(seed);
    noiseSeed(seed);
    
    // Select random palette
    selectedPalette = random(colorPalettes);
    
    // Generate stripe data
    generateStripeData();
    
    // Redraw the doormat
    redraw();
}

function generateStripeData() {
    stripeData = [];
    let totalHeight = doormatHeight;
    let currentY = 0;
    
    while (currentY < totalHeight) {
        // Random stripe height between 8 and 40 pixels
        let stripeHeight = random(8, 40);
        
        // Ensure we don't exceed the total height
        if (currentY + stripeHeight > totalHeight) {
            stripeHeight = totalHeight - currentY;
        }
        
        // Select colors for this stripe
        let primaryColor = random(selectedPalette.colors);
        let hasSecondaryColor = random() < 0.3; // 30% chance of blended colors
        let secondaryColor = hasSecondaryColor ? random(selectedPalette.colors) : null;
        
        // Determine weave pattern type
        let weaveType = random(['solid', 'mixed', 'textured']);
        
        stripeData.push({
            y: currentY,
            height: stripeHeight,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            weaveType: weaveType,
            warpVariation: random(0.1, 0.5) // How much the weave varies
        });
        
        currentY += stripeHeight;
    }
}

function draw() {
    background(245, 245, 220); // Beige background
    
    // Draw the main doormat area
    push();
    translate(fringeLength, fringeLength);
    
    // Draw stripes
    for (let stripe of stripeData) {
        drawStripe(stripe);
    }
    
    // Add overall texture overlay
    drawTextureOverlay();
    
    pop();
    
    // Draw fringe
    drawFringe();
    
    // Draw border
    drawBorder();
}

function drawStripe(stripe) {
    // More realistic thread sizes for cloth-like appearance
    let weftSize = 2; // Height of individual weft threads
    let warpSize = 2; // Width of individual warp threads
    
    // Draw the base stripe with weft threads (horizontal)
    for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSize) {
        for (let x = 0; x < doormatWidth; x += warpSize) {
            let baseColor = color(stripe.primaryColor);
            
            // Add variation based on weave type
            if (stripe.weaveType === 'mixed' && stripe.secondaryColor) {
                // Randomly mix primary and secondary colors
                if (noise(x * 0.1, y * 0.1) > 0.5) {
                    baseColor = color(stripe.secondaryColor);
                }
            } else if (stripe.weaveType === 'textured') {
                // Add noise-based brightness variation
                let noiseVal = noise(x * 0.05, y * 0.05);
                baseColor = lerpColor(color(stripe.primaryColor), color(255), noiseVal * 0.2);
            }
            
            // Add more realistic fabric irregularities
            let r = red(baseColor) + random(-20, 20);
            let g = green(baseColor) + random(-20, 20);
            let b = blue(baseColor) + random(-20, 20);
            
            r = constrain(r, 0, 255);
            g = constrain(g, 0, 255);
            b = constrain(b, 0, 255);
            
            fill(r, g, b);
            noStroke();
            
            // Draw individual weft thread segment with slight curve
            let threadCurve = sin(x * 0.1) * 0.5;
            rect(x, y + threadCurve, warpSize, weftSize);
        }
    }
    
    // Draw warp threads (vertical) that are visible through the weave
    for (let x = 0; x < doormatWidth; x += warpSize * 2) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSize) {
            // Only show warp threads occasionally to create the woven effect
            if (random() < 0.3) {
                let warpColor = color(stripe.primaryColor);
                
                // Make warp threads slightly darker
                let r = red(warpColor) * 0.8;
                let g = green(warpColor) * 0.8;
                let b = blue(warpColor) * 0.8;
                
                fill(r, g, b, 150); // Semi-transparent
                noStroke();
                
                // Draw thin vertical warp thread
                let warpCurve = cos(y * 0.1) * 0.3;
                rect(x + warpCurve, y, 1, weftSize);
            }
        }
    }
    
    // Add subtle texture overlay for cloth-like appearance
    for (let x = 0; x < doormatWidth; x += 4) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += 4) {
            let noiseVal = noise(x * 0.02, y * 0.02);
            if (noiseVal > 0.6) {
                fill(255, 255, 255, 30); // Subtle highlight
                noStroke();
                ellipse(x, y, 1, 1);
            } else if (noiseVal < 0.4) {
                fill(0, 0, 0, 20); // Subtle shadow
                noStroke();
                ellipse(x, y, 1, 1);
            }
        }
    }
}

function drawTextureOverlay() {
    // Add more realistic fabric texture overlay
    push();
    blendMode(OVERLAY);
    
    // Create subtle fabric grain
    for (let x = 0; x < doormatWidth; x += 3) {
        for (let y = 0; y < doormatHeight; y += 3) {
            let noiseVal = noise(x * 0.01, y * 0.01);
            let grainIntensity = map(noiseVal, 0, 1, -30, 30);
            
            fill(255 + grainIntensity, 255 + grainIntensity, 255 + grainIntensity, 40);
            noStroke();
            rect(x, y, 3, 3);
        }
    }
    
    // Add subtle weave pattern
    for (let x = 0; x < doormatWidth; x += 8) {
        for (let y = 0; y < doormatHeight; y += 8) {
            let weaveNoise = noise(x * 0.05, y * 0.05);
            if (weaveNoise > 0.7) {
                fill(255, 255, 255, 20);
                noStroke();
                rect(x, y, 8, 8);
            } else if (weaveNoise < 0.3) {
                fill(0, 0, 0, 15);
                noStroke();
                rect(x, y, 8, 8);
            }
        }
    }
    
    pop();
}

function drawFringe() {
    // Top fringe
    drawFringeSection(fringeLength, 0, doormatWidth, fringeLength, 'top');
    
    // Bottom fringe
    drawFringeSection(fringeLength, fringeLength + doormatHeight, doormatWidth, fringeLength, 'bottom');
    
    // Add subtle shadow under the doormat
    push();
    fill(0, 0, 0, 30);
    noStroke();
    rect(fringeLength + 5, fringeLength + doormatHeight + 5, doormatWidth - 10, 10);
    pop();
}

function drawFringeSection(x, y, w, h, side) {
    let fringeStrands = w / 6; // More fringe strands for realistic look
    let strandWidth = w / fringeStrands;
    
    for (let i = 0; i < fringeStrands; i++) {
        let strandX = x + i * strandWidth;
        let strandColor = random(selectedPalette.colors);
        
        // Draw individual fringe strand with more realistic appearance
        for (let j = 0; j < 8; j++) { // Fewer but thicker threads per strand
            let threadX = strandX + random(-strandWidth/4, strandWidth/4);
            let startY = side === 'top' ? y + h : y;
            let endY = side === 'top' ? y : y + h;
            
            // Add more natural curl/wave to the fringe
            let waveAmplitude = random(2, 6);
            let waveFreq = random(0.2, 0.4);
            
            // Use darker version of strand color for fringe
            let fringeColor = color(strandColor);
            let r = red(fringeColor) * 0.7;
            let g = green(fringeColor) * 0.7;
            let b = blue(fringeColor) * 0.7;
            
            stroke(r, g, b);
            strokeWeight(random(1, 2.5));
            
            noFill();
            beginShape();
            for (let t = 0; t <= 1; t += 0.05) {
                let yPos = lerp(startY, endY, t);
                let xOffset = sin(t * PI * waveFreq) * waveAmplitude * t;
                // Add some randomness to make it look more natural
                xOffset += random(-1, 1);
                vertex(threadX + xOffset, yPos);
            }
            endShape();
        }
    }
}

function drawBorder() {
    // Draw a subtle border around the entire doormat
    push();
    noFill();
    stroke(101, 67, 33); // Dark brown
    strokeWeight(2);
    rect(1, 1, width - 2, height - 2);
    pop();
}

// Global function to be called from HTML
function generateDoormat(seed) {
    if (typeof window !== 'undefined') {
        window.generateDoormat = function(seed) {
            currentSeed = seed;
            randomSeed(seed);
            noiseSeed(seed);
            
            selectedPalette = random(colorPalettes);
            generateStripeData();
            redraw();
        };
    }
    
    // Call the function immediately if we're setting it up
    currentSeed = seed;
    randomSeed(seed);
    noiseSeed(seed);
    
    selectedPalette = random(colorPalettes);
    generateStripeData();
    if (typeof redraw === 'function') {
        redraw();
    }
}
