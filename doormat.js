// Generative Doormat Art - P5.js
// Inspired by traditional woven doormats with stripes and fringe

let doormatWidth = 400;
let doormatHeight = 600;
let fringeLength = 30;
let currentSeed = 42;
let warpThickness = 2; // Default warp thread thickness
let weftThickness = 2; // Default weft thread thickness

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
    
    // Draw selvedge edges (inside translated context)
    drawSelvedgeEdges();
    
    // Add overall texture overlay
    drawTextureOverlay();
    
    pop();
    
    // Draw fringe
    drawFringe();
    
    // Draw border
    drawBorder();
}

function drawStripe(stripe) {
    // Create a proper plain weave structure like the diagram
    let warpSpacing = warpThickness + 1; // Space between warp threads
    let weftSpacing = weftThickness + 1; // Space between weft threads
    
    // First, draw the warp threads (vertical) as the foundation
    for (let x = 0; x < doormatWidth; x += warpSpacing) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing) {
            let warpColor = color(stripe.primaryColor);
            
            // Add subtle variation to warp threads
            let r = red(warpColor) + random(-15, 15);
            let g = green(warpColor) + random(-15, 15);
            let b = blue(warpColor) + random(-15, 15);
            
            r = constrain(r, 0, 255);
            g = constrain(g, 0, 255);
            b = constrain(b, 0, 255);
            
            fill(r, g, b);
            noStroke();
            
            // Draw warp thread with slight curve for natural look
            let warpCurve = sin(y * 0.05) * 0.5;
            rect(x + warpCurve, y, warpThickness, weftSpacing);
        }
    }
    
    // Now draw the weft threads (horizontal) that interlace with warp
    for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing) {
        for (let x = 0; x < doormatWidth; x += warpSpacing) {
            let weftColor = color(stripe.primaryColor);
            
            // Add variation based on weave type
            if (stripe.weaveType === 'mixed' && stripe.secondaryColor) {
                if (noise(x * 0.1, y * 0.1) > 0.5) {
                    weftColor = color(stripe.secondaryColor);
                }
            } else if (stripe.weaveType === 'textured') {
                let noiseVal = noise(x * 0.05, y * 0.05);
                weftColor = lerpColor(color(stripe.primaryColor), color(255), noiseVal * 0.15);
            }
            
            // Add fabric irregularities
            let r = red(weftColor) + random(-20, 20);
            let g = green(weftColor) + random(-20, 20);
            let b = blue(weftColor) + random(-20, 20);
            
            r = constrain(r, 0, 255);
            g = constrain(g, 0, 255);
            b = constrain(b, 0, 255);
            
            fill(r, g, b);
            noStroke();
            
            // Draw weft thread with slight curve
            let weftCurve = cos(x * 0.05) * 0.5;
            rect(x, y + weftCurve, warpSpacing, weftThickness);
        }
    }
    
    // Add the interlacing effect - make some threads appear to go over/under
    for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing * 2) {
        for (let x = 0; x < doormatWidth; x += warpSpacing * 2) {
            // Create shadow effect for threads that appear to go under
            fill(0, 0, 0, 40);
            noStroke();
            rect(x + 1, y + 1, warpSpacing - 2, weftSpacing - 2);
        }
    }
    
    // Add subtle highlights for threads that appear to go over
    for (let y = stripe.y + weftSpacing; y < stripe.y + stripe.height; y += weftSpacing * 2) {
        for (let x = warpSpacing; x < doormatWidth; x += warpSpacing * 2) {
            fill(255, 255, 255, 30);
            noStroke();
            rect(x, y, warpSpacing - 1, weftSpacing - 1);
        }
    }
}

function drawTextureOverlay() {
    // Add texture that matches the plain weave diagram
    push();
    blendMode(MULTIPLY);
    
    // Create subtle hatching effect like in the diagram
    for (let x = 0; x < doormatWidth; x += 2) {
        for (let y = 0; y < doormatHeight; y += 2) {
            let noiseVal = noise(x * 0.02, y * 0.02);
            let hatchingIntensity = map(noiseVal, 0, 1, 0, 50);
            
            fill(0, 0, 0, hatchingIntensity);
            noStroke();
            rect(x, y, 2, 2);
        }
    }
    
    // Add subtle relief effect to show the bumpy, cloth-like surface
    for (let x = 0; x < doormatWidth; x += 6) {
        for (let y = 0; y < doormatHeight; y += 6) {
            let reliefNoise = noise(x * 0.03, y * 0.03);
            if (reliefNoise > 0.6) {
                fill(255, 255, 255, 25);
                noStroke();
                rect(x, y, 6, 6);
            } else if (reliefNoise < 0.4) {
                fill(0, 0, 0, 20);
                noStroke();
                rect(x, y, 6, 6);
            }
        }
    }
    
    pop();
}

function drawFringe() {
    // Top fringe (warp ends)
    drawFringeSection(fringeLength, 0, doormatWidth, fringeLength, 'top');
    
    // Bottom fringe (warp ends)
    drawFringeSection(fringeLength, fringeLength + doormatHeight, doormatWidth, fringeLength, 'bottom');
    
    // Draw selvedge edges (weft loops) on left and right sides
    drawSelvedgeEdges();
    
    // Add subtle shadow under the doormat
    push();
    fill(0, 0, 0, 30);
    noStroke();
    rect(fringeLength + 5, fringeLength + doormatHeight + 5, doormatWidth - 10, 10);
    pop();
}

function drawSelvedgeEdges() {
    // Left selvedge edge - flowing semicircular weft threads
    // Use the same spacing as the actual weft threads in drawStripe
    let weftSpacing = weftThickness + 1;
    
    // FIXED: Use relative coordinates like the weft threads (accounting for canvas translation)
    for (let y = 0; y < doormatHeight; y += weftSpacing) {
        // Find the stripe that contains this y position (using relative coordinates)
        let currentStripe = null;
        for (let stripe of stripeData) {
            if (y >= stripe.y && y < stripe.y + stripe.height) {
                currentStripe = stripe;
                break;
            }
        }
        
        if (currentStripe) {
            // Get the color from the current stripe
            let selvedgeColor = color(currentStripe.primaryColor);
            
            // Check if there's a secondary color for blending
            if (currentStripe.secondaryColor && currentStripe.weaveType === 'mixed') {
                let secondaryColor = color(currentStripe.secondaryColor);
                // Blend the colors based on noise for variation
                let blendFactor = noise(y * 0.1) * 0.5 + 0.5;
                selvedgeColor = lerpColor(selvedgeColor, secondaryColor, blendFactor);
            }
            
            let r = red(selvedgeColor) * 0.8;
            let g = green(selvedgeColor) * 0.8;
            let b = blue(selvedgeColor) * 0.8;
            
            fill(r, g, b);
            noStroke();
            
            let radius = weftThickness * 1.5; // Size based on weft thickness
            let centerX = 0; // Left edge of the translated canvas (relative coordinates)
            let centerY = y + weftThickness/2; // Align with the center of the weft thread
            
            // Draw the semicircle (flowing from left to right)
            arc(centerX, centerY, radius * 2, radius * 2, HALF_PI, -HALF_PI);
            
            // Add subtle shadow for depth
            fill(r * 0.7, g * 0.7, b * 0.7, 100);
            arc(centerX + 1, centerY + 1, radius * 2, radius * 2, HALF_PI, -HALF_PI);
        }
    }
    
    // Right selvedge edge - flowing semicircular weft threads
    for (let y = 0; y < doormatHeight; y += weftSpacing) {
        // Find the stripe that contains this y position (using relative coordinates)
        let currentStripe = null;
        for (let stripe of stripeData) {
            if (y >= stripe.y && y < stripe.y + stripe.height) {
                currentStripe = stripe;
                break;
            }
        }
        
        if (currentStripe) {
            // Get the color from the current stripe
            let selvedgeColor = color(currentStripe.primaryColor);
            
            // Check if there's a secondary color for blending
            if (currentStripe.secondaryColor && currentStripe.weaveType === 'mixed') {
                let secondaryColor = color(currentStripe.secondaryColor);
                // Blend the colors based on noise for variation
                let blendFactor = noise(y * 0.1) * 0.5 + 0.5;
                selvedgeColor = lerpColor(selvedgeColor, secondaryColor, blendFactor);
            }
            
            let r = red(selvedgeColor) * 0.8;
            let g = green(selvedgeColor) * 0.8;
            let b = blue(selvedgeColor) * 0.8;
            
            fill(r, g, b);
            noStroke();
            
            let radius = weftThickness * 1.5; // Size based on weft thickness
            let centerX = doormatWidth; // Right edge of the translated canvas (relative coordinates)
            let centerY = y + weftThickness/2; // Align with the center of the weft thread
            
            // Draw the semicircle (flowing from right to left)
            arc(centerX, centerY, radius * 2, radius * 2, -HALF_PI, HALF_PI);
            
            // Add subtle shadow for depth
            fill(r * 0.7, g * 0.7, b * 0.7, 100);
            arc(centerX - 1, centerY + 1, radius * 2, radius * 2, -HALF_PI, HALF_PI);
        }
    }
}

function drawFringeSection(x, y, w, h, side) {
    let fringeStrands = w / 12; // More fringe strands for thinner threads
    let strandWidth = w / fringeStrands;
    
    for (let i = 0; i < fringeStrands; i++) {
        let strandX = x + i * strandWidth;
        let strandColor = random(selectedPalette.colors);
        
        // Draw individual fringe strand with thin threads
        for (let j = 0; j < 12; j++) { // More but thinner threads per strand
            let threadX = strandX + random(-strandWidth/6, strandWidth/6);
            let startY = side === 'top' ? y + h : y;
            let endY = side === 'top' ? y : y + h;
            
            // Add natural curl/wave to the fringe
            let waveAmplitude = random(1, 3);
            let waveFreq = random(0.3, 0.5);
            
            // Use darker version of strand color for fringe
            let fringeColor = color(strandColor);
            let r = red(fringeColor) * 0.7;
            let g = green(fringeColor) * 0.7;
            let b = blue(fringeColor) * 0.7;
            
            stroke(r, g, b);
            strokeWeight(random(0.5, 1)); // Much thinner threads
            
            noFill();
            beginShape();
            for (let t = 0; t <= 1; t += 0.1) {
                let yPos = lerp(startY, endY, t);
                let xOffset = sin(t * PI * waveFreq) * waveAmplitude * t;
                // Add some randomness to make it look more natural
                xOffset += random(-0.5, 0.5);
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

// Function to update warp thickness from HTML slider
function updateWarpThicknessInSketch(thickness) {
    warpThickness = thickness;
    redraw();
}

// Function to update weft thickness from HTML slider
function updateWeftThicknessInSketch(thickness) {
    weftThickness = thickness;
    redraw();
}

// Make the functions globally available
if (typeof window !== 'undefined') {
    window.updateWarpThicknessInSketch = updateWarpThicknessInSketch;
    window.updateWeftThicknessInSketch = updateWeftThicknessInSketch;
}
