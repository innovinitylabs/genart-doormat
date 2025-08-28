// Generative Doormat Art - P5.js
// Inspired by traditional woven doormats with stripes and fringe

let doormatWidth = 600;
let doormatHeight = 400;
let fringeLength = 30;
let currentSeed = 42;

// Color palettes inspired by traditional doormats
const colorPalettes = [
    // Earthy palette
    {
        name: "Earthy",
        colors: [
            '#8B4513', // Saddle Brown
            '#D2691E', // Chocolate  
            '#F4A460', // Sandy Brown
            '#DEB887', // Burlywood
            '#CD853F', // Peru
            '#A0522D', // Sienna
            '#F5DEB3', // Wheat
            '#FFE4B5'  // Moccasin
        ]
    },
    // Traditional palette
    {
        name: "Traditional",
        colors: [
            '#B22222', // Fire Brick
            '#228B22', // Forest Green
            '#4169E1', // Royal Blue
            '#FFD700', // Gold
            '#8B0000', // Dark Red
            '#006400', // Dark Green
            '#191970', // Midnight Blue
            '#F5F5DC'  // Beige
        ]
    },
    // Ocean palette
    {
        name: "Ocean",
        colors: [
            '#008B8B', // Dark Cyan
            '#20B2AA', // Light Sea Green
            '#4682B4', // Steel Blue
            '#5F9EA0', // Cadet Blue
            '#708090', // Slate Gray
            '#2F4F4F', // Dark Slate Gray
            '#F0F8FF', // Alice Blue
            '#E0FFFF'  // Light Cyan
        ]
    },
    // Sunset palette
    {
        name: "Sunset",
        colors: [
            '#FF4500', // Orange Red
            '#FF6347', // Tomato
            '#FFD700', // Gold
            '#FF8C00', // Dark Orange
            '#DC143C', // Crimson
            '#B22222', // Fire Brick
            '#FFFFE0', // Light Yellow
            '#FFF8DC'  // Cornsilk
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
    let weftSize = 3; // Height of individual weft threads
    let warpSize = 4; // Width of individual warp threads
    
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
                baseColor = lerpColor(color(stripe.primaryColor), color(255), noiseVal * 0.3);
            }
            
            // Add slight random variation to simulate fabric irregularities
            let r = red(baseColor) + random(-15, 15);
            let g = green(baseColor) + random(-15, 15);
            let b = blue(baseColor) + random(-15, 15);
            
            r = constrain(r, 0, 255);
            g = constrain(g, 0, 255);
            b = constrain(b, 0, 255);
            
            fill(r, g, b);
            noStroke();
            
            // Draw individual warp/weft intersection
            rect(x, y, warpSize, weftSize);
            
            // Occasionally add darker lines to simulate thread shadows
            if (random() < 0.1) {
                fill(r * 0.7, g * 0.7, b * 0.7);
                rect(x, y + weftSize - 1, warpSize, 1);
            }
        }
    }
}

function drawTextureOverlay() {
    // Add subtle overall texture to simulate fabric
    push();
    blendMode(MULTIPLY);
    loadPixels();
    
    for (let x = 0; x < doormatWidth; x += 2) {
        for (let y = 0; y < doormatHeight; y += 2) {
            let noiseVal = noise(x * 0.02, y * 0.02);
            let alpha = map(noiseVal, 0, 1, 240, 255);
            fill(255, alpha);
            noStroke();
            rect(x, y, 2, 2);
        }
    }
    pop();
}

function drawFringe() {
    // Top fringe
    drawFringeSection(fringeLength, 0, doormatWidth, fringeLength, 'top');
    
    // Bottom fringe
    drawFringeSection(fringeLength, fringeLength + doormatHeight, doormatWidth, fringeLength, 'bottom');
}

function drawFringeSection(x, y, w, h, side) {
    let fringeStrands = w / 8; // Number of fringe strands
    let strandWidth = w / fringeStrands;
    
    for (let i = 0; i < fringeStrands; i++) {
        let strandX = x + i * strandWidth;
        let strandColor = random(selectedPalette.colors);
        
        // Draw individual fringe strand
        for (let j = 0; j < 15; j++) { // Multiple threads per strand
            let threadX = strandX + random(-strandWidth/3, strandWidth/3);
            let startY = side === 'top' ? y + h : y;
            let endY = side === 'top' ? y : y + h;
            
            // Add some curl/wave to the fringe
            let waveAmplitude = random(3, 8);
            let waveFreq = random(0.1, 0.3);
            
            stroke(strandColor);
            strokeWeight(random(0.5, 1.5));
            
            noFill();
            beginShape();
            for (let t = 0; t <= 1; t += 0.1) {
                let yPos = lerp(startY, endY, t);
                let xOffset = sin(t * PI * waveFreq) * waveAmplitude * t;
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
