// Generative Doormat Art - P5.js
// Inspired by traditional woven doormats with stripes and fringe

let doormatWidth = 800;
let doormatHeight = 1200;
let fringeLength = 30;
let currentSeed = 42;
let warpThickness = 2; // Will be set randomly
let weftThickness = 8; // Default weft thread thickness
const TEXT_SCALE = 2; // scale factor
const MAX_CHARS = 11;

// Text colors (chosen from palette)
let lightTextColor;
let darkTextColor;

function updateTextColors() {
    if (!selectedPalette || !selectedPalette.colors) return;
    let darkest = selectedPalette.colors[0];
    let lightest = selectedPalette.colors[0];
    let darkestVal = 999, lightestVal = -1;
    for (let hex of selectedPalette.colors) {
        let c = color(hex);
        let bright = (red(c) + green(c) + blue(c)) / 3;
        if (bright < darkestVal) { darkestVal = bright; darkest = hex; }
        if (bright > lightestVal) { lightestVal = bright; lightest = hex; }
    }
    darkTextColor = color(darkest);
    // make colours more contrasted
    lightTextColor = lerpColor(color(lightest), color(255), 0.3);
    darkTextColor  = lerpColor(color(darkest), color(0),   0.4);
}

// Color palettes are now loaded from external file (color-palettes.js)
let selectedPalette;
let stripeData = [];
let doormatTextRows = []; // Array of text rows to embed in the doormat
let textData = []; // Text positioning and character data

// Make stripeData globally available for NFT export
window.stripeData = stripeData;

// Initialize with a default palette
function initializePalette() {
    if (!selectedPalette) {
        selectedPalette = colorPalettes[0]; // Use first palette as default
    }
    updateTextColors();
}

function setup() {
    // Create canvas with swapped dimensions for 90-degree rotation
    // After rotation: width becomes height, height becomes width
    // Increased buffer for frayed edges and selvedge variations
    let canvas = createCanvas(doormatHeight + (fringeLength * 4), doormatWidth + (fringeLength * 4));
    canvas.parent('canvas-container');
    
    // Initialize palette
    initializePalette();
    
    noLoop();
}

function generateDoormat(seed) {
    currentSeed = seed;
    randomSeed(seed);
    noiseSeed(seed);
    
    // Set random warp thickness between 1 and 6
    warpThickness = random([1, 2, 3, 4, 5, 6]);
    console.log("Generated warp thickness:", warpThickness);
    
    // Select random palette
    selectedPalette = random(colorPalettes);
    updateTextColors();
    
    // Generate stripe data
    generateStripeData();
    
    // Redraw the doormat
    redraw();
    
    // Update traits after everything is generated
    if (typeof window !== 'undefined' && typeof window.updateTraitsFromSketch === 'function') {
        console.log("Calling updateTraitsFromSketch from generateDoormat");
        setTimeout(() => {
            window.updateTraitsFromSketch();
        }, 100);
    } else {
        console.log("updateTraitsFromSketch function not available");
    }
}

function generateStripeData() {
    stripeData = [];
    let totalHeight = doormatHeight;
    let currentY = 0;
    
    // Safety check for selectedPalette
    if (!selectedPalette || !selectedPalette.colors) {
        initializePalette();
    }
    
    // Decide stripe density pattern for this doormat
    let densityType = random();
    let minHeight, maxHeight;
    
    if (densityType < 0.2) {
        // 20% chance: High density (many thin stripes)
        minHeight = 15;
        maxHeight = 35;
    } else if (densityType < 0.4) {
        // 20% chance: Low density (fewer thick stripes) 
        minHeight = 50;
        maxHeight = 90;
    } else {
        // 60% chance: Mixed density (varied stripe sizes)
        minHeight = 20;
        maxHeight = 80;
    }
    
    while (currentY < totalHeight) {
        // Dynamic stripe height based on density type
        let stripeHeight;
        if (densityType >= 0.4) {
            // Mixed density: add more randomization within the range
            let variationType = random();
            if (variationType < 0.3) {
                // 30% thin stripes within mixed
                stripeHeight = random(minHeight, minHeight + 20);
            } else if (variationType < 0.6) {
                // 30% medium stripes within mixed
                stripeHeight = random(minHeight + 15, maxHeight - 15);
            } else {
                // 40% thick stripes within mixed
                stripeHeight = random(maxHeight - 25, maxHeight);
            }
        } else {
            // High/Low density: more consistent sizing
            stripeHeight = random(minHeight, maxHeight);
        }
        
        // Ensure we don't exceed the total height
        if (currentY + stripeHeight > totalHeight) {
            stripeHeight = totalHeight - currentY;
        }
        
        // Select colors for this stripe
        let primaryColor = random(selectedPalette.colors);
        let hasSecondaryColor = random() < 0.15; // 15% chance of blended colors (reduced from 30%)
        let secondaryColor = hasSecondaryColor ? random(selectedPalette.colors) : null;
        
        // Determine weave pattern type with weighted probabilities
        let weaveRand = random();
        let weaveType;
        if (weaveRand < 0.6) {          // 60% chance of solid (simple)
            weaveType = 'solid';
        } else if (weaveRand < 0.8) {   // 20% chance of textured 
            weaveType = 'textured';
        } else {                        // 20% chance of mixed (most complex)
            weaveType = 'mixed';
        }
        
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
    // Use a background that won't create visible bands after rotation
    background(222, 222, 222); // Pure white background to avoid visible bands
    
    // Rotate canvas 90 degrees clockwise
    push();
    translate(width/2, height/2);
    rotate(PI/2);
    translate(-height/2, -width/2);
    
    // Draw the main doormat area
    push();
    // Center the doormat within the larger canvas buffer
    translate(fringeLength * 2, fringeLength * 2);
    
    // Draw stripes
    for (let stripe of stripeData) {
        drawStripe(stripe);
    }
    
    // Add overall texture overlay
    drawTextureOverlay();
    
    pop();
    
    // Draw fringe with adjusted positioning for larger canvas
    drawFringe();
    
    pop(); // End rotation
    

}

function drawStripe(stripe) {
    // Create a proper plain weave structure like the diagram
    let warpSpacing = warpThickness + 1; // Space between warp threads
    let weftSpacing = weftThickness + 1; // Space between weft threads
    
    // First, draw the warp threads (vertical) as the foundation
    for (let x = 0; x < doormatWidth; x += warpSpacing) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing) {
            let warpColor = color(stripe.primaryColor);
            
            // Check if this position should be modified for text
            let isTextPixel = false;
            if (textData.length > 0) {
                for (let textPixel of textData) {
                    if (x >= textPixel.x && x < textPixel.x + textPixel.width &&
                        y >= textPixel.y && y < textPixel.y + textPixel.height) {
                        isTextPixel = true;
                        break;
                    }
                }
            }
            
            // Add subtle variation to warp threads
            let r = red(warpColor) + random(-15, 15);
            let g = green(warpColor) + random(-15, 15);
            let b = blue(warpColor) + random(-15, 15);
            
            // Modify color for text pixels (vertical lines use weft thickness)
            if (isTextPixel) {
                const bgBrightness = (r + g + b) / 3;
                let tc = bgBrightness < 128 ? lightTextColor : darkTextColor;
                r = red(tc); g = green(tc); b = blue(tc);
            }
            
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
            
            // Check if this position should be modified for text
            let isTextPixel = false;
            if (textData.length > 0) {
                for (let textPixel of textData) {
                    if (x >= textPixel.x && x < textPixel.x + textPixel.width &&
                        y >= textPixel.y && y < textPixel.y + textPixel.height) {
                        isTextPixel = true;
                        break;
                    }
                }
            }
            
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
            
            // Modify color for text pixels (horizontal lines use warp thickness)
            if (isTextPixel) {
                const bgBrightness = (r + g + b) / 3;
                let tc = bgBrightness < 128 ? lightTextColor : darkTextColor;
                r = red(tc); g = green(tc); b = blue(tc);
            }
            
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
    // Top fringe - adjusted for larger canvas buffer
    drawFringeSection(fringeLength * 2, fringeLength, doormatWidth, fringeLength, 'top');
    
    // Bottom fringe - adjusted for larger canvas buffer
    drawFringeSection(fringeLength * 2, fringeLength * 2 + doormatHeight, doormatWidth, fringeLength, 'bottom');
    
    // Draw selvedge edges (weft loops) on left and right sides
    drawSelvedgeEdges();
    

}

function drawSelvedgeEdges() {
    // Left selvedge edge - flowing semicircular weft threads
    // Use the same spacing as the actual weft threads in drawStripe
    let weftSpacing = weftThickness + 1;
    
    // Loop through each stripe and draw selvedge for each weft thread in that stripe
    let isFirstWeft = true;
    let isLastWeft = false;
    
    for (let stripe of stripeData) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing) {
            // Skip the very first and very last weft threads of the entire doormat
            if (isFirstWeft) {
                isFirstWeft = false;
                continue;
            }
            
            // Check if this is the last weft thread
            if (stripe === stripeData[stripeData.length - 1] && y + weftSpacing >= stripe.y + stripe.height) {
                isLastWeft = true;
                continue; // Skip this last weft thread instead of breaking
            }
            
            // Get the color from the current stripe
            let selvedgeColor = color(stripe.primaryColor);
            
            // Check if there's a secondary color for blending
            if (stripe.secondaryColor && stripe.weaveType === 'mixed') {
                let secondaryColor = color(stripe.secondaryColor);
                // Blend the colors based on noise for variation
                let blendFactor = noise(y * 0.1) * 0.5 + 0.5;
                selvedgeColor = lerpColor(selvedgeColor, secondaryColor, blendFactor);
            }
            
            let r = red(selvedgeColor) * 0.8;
            let g = green(selvedgeColor) * 0.8;
            let b = blue(selvedgeColor) * 0.8;
            
            fill(r, g, b);
            noStroke();
            
            let radius = weftThickness * random(1.2, 1.8); // Vary size slightly
            let centerX = fringeLength * 2 + random(-2, 2); // Slight position variation
            let centerY = fringeLength * 2 + y + weftThickness/2 + random(-1, 1); // Slight vertical variation
            
            // Vary the arc angles for more natural look
            let startAngle = HALF_PI + random(-0.2, 0.2);
            let endAngle = -HALF_PI + random(-0.2, 0.2);
            
            // Draw textured semicircle with individual thread details
            drawTexturedSelvedgeArc(centerX, centerY, radius, startAngle, endAngle, r, g, b, 'left');
        }
    }
    
    // Right selvedge edge - flowing semicircular weft threads
    let isFirstWeftRight = true;
    let isLastWeftRight = false;
    
    for (let stripe of stripeData) {
        for (let y = stripe.y; y < stripe.y + stripe.height; y += weftSpacing) {
            // Skip the very first and very last weft threads of the entire doormat
            if (isFirstWeftRight) {
                isFirstWeftRight = false;
                continue;
            }
            
            // Check if this is the last weft thread
            if (stripe === stripeData[stripeData.length - 1] && y + weftSpacing >= stripe.y + stripe.height) {
                isLastWeftRight = true;
                continue; // Skip this last weft thread instead of breaking
            }
            
            // Get the color from the current stripe
            let selvedgeColor = color(stripe.primaryColor);
            
            // Check if there's a secondary color for blending
            if (stripe.secondaryColor && stripe.weaveType === 'mixed') {
                let secondaryColor = color(stripe.secondaryColor);
                // Blend the colors based on noise for variation
                let blendFactor = noise(y * 0.1) * 0.5 + 0.5;
                selvedgeColor = lerpColor(selvedgeColor, secondaryColor, blendFactor);
            }
            
            let r = red(selvedgeColor) * 0.8;
            let g = green(selvedgeColor) * 0.8;
            let b = blue(selvedgeColor) * 0.8;
            
            fill(r, g, b);
            noStroke();
            
            let radius = weftThickness * random(1.2, 1.8); // Vary size slightly
            let centerX = fringeLength * 2 + doormatWidth + random(-2, 2); // Slight position variation
            let centerY = fringeLength * 2 + y + weftThickness/2 + random(-1, 1); // Slight vertical variation
            
            // Vary the arc angles for more natural look
            let startAngle = -HALF_PI + random(-0.2, 0.2);
            let endAngle = HALF_PI + random(-0.2, 0.2);
            
            // Draw textured semicircle with individual thread details
            drawTexturedSelvedgeArc(centerX, centerY, radius, startAngle, endAngle, r, g, b, 'right');
        }
    }
}

function drawTexturedSelvedgeArc(centerX, centerY, radius, startAngle, endAngle, r, g, b, side) {
    // Draw a realistic textured selvedge arc with visible woven texture
    let threadCount = max(6, floor(radius / 1.2)); // More threads for visible texture
    let threadSpacing = radius / threadCount;
    
    // Draw individual thread arcs to create visible woven texture
    for (let i = 0; i < threadCount; i++) {
        let threadRadius = radius - (i * threadSpacing);
        
        // Create distinct thread colors for visible texture
        let threadR, threadG, threadB;
        
        if (i % 2 === 0) {
            // Lighter threads
            threadR = constrain(r + 25, 0, 255);
            threadG = constrain(g + 25, 0, 255);
            threadB = constrain(b + 25, 0, 255);
        } else {
            // Darker threads
            threadR = constrain(r - 20, 0, 255);
            threadG = constrain(g - 20, 0, 255);
            threadB = constrain(b - 20, 0, 255);
        }
        
        // Add some random variation for natural look
        threadR = constrain(threadR + random(-10, 10), 0, 255);
        threadG = constrain(threadG + random(-10, 10), 0, 255);
        threadB = constrain(threadB + random(-10, 10), 0, 255);
        
        fill(threadR, threadG, threadB, 88); // More transparent for better blending
        
        // Draw individual thread arc with slight position variation
        let threadX = centerX + random(-1, 1);
        let threadY = centerY + random(-1, 1);
        let threadStartAngle = startAngle + random(-0.1, 0.1);
        let threadEndAngle = endAngle + random(-0.1, 0.1);
        
        arc(threadX, threadY, threadRadius * 2, threadRadius * 2, threadStartAngle, threadEndAngle);
    }
    
    // Add a few more detailed texture layers
    for (let i = 0; i < 3; i++) {
        let detailRadius = radius * (0.3 + i * 0.2);
        let detailAlpha = 180 - (i * 40);
        
        // Create contrast for visibility
        let detailR = constrain(r + (i % 2 === 0 ? 15 : -15), 0, 255);
        let detailG = constrain(g + (i % 2 === 0 ? 15 : -15), 0, 255);
        let detailB = constrain(b + (i % 2 === 0 ? 15 : -15), 0, 255);
        
        fill(detailR, detailG, detailB, detailAlpha * 0.7); // More transparent detail layers
        
        let detailX = centerX + random(-0.5, 0.5);
        let detailY = centerY + random(-0.5, 0.5);
        let detailStartAngle = startAngle + random(-0.05, 0.05);
        let detailEndAngle = endAngle + random(-0.05, 0.05);
        
        arc(detailX, detailY, detailRadius * 2, detailRadius * 2, detailStartAngle, detailEndAngle);
    }
    
    // Add subtle shadow for depth
            fill(r * 0.6, g * 0.6, b * 0.6, 70); // More transparent shadow
    let shadowOffset = side === 'left' ? 1 : -1;
    arc(centerX + shadowOffset, centerY + 1, radius * 2, radius * 2, startAngle, endAngle);
    
    // Add small transparent hole in the center
    noFill();
    arc(centerX, centerY, radius * 0.5, radius * 0.5, startAngle, endAngle);
    
    // Add visible texture details - small bumps and knots
    for (let i = 0; i < 8; i++) {
        let detailAngle = random(startAngle, endAngle);
        let detailRadius = radius * random(0.2, 0.7);
        let detailX = centerX + cos(detailAngle) * detailRadius;
        let detailY = centerY + sin(detailAngle) * detailRadius;
        
        // Alternate between light and dark for visible contrast
        if (i % 2 === 0) {
            fill(r + 20, g + 20, b + 20, 120); // More transparent light bumps
        } else {
            fill(r - 15, g - 15, b - 15, 120); // More transparent dark bumps
        }
        
        noStroke();
        ellipse(detailX, detailY, random(1.5, 3.5), random(1.5, 3.5));
    }
}

function drawFringeSection(x, y, w, h, side) {
    let fringeStrands = w / 12; // More fringe strands for thinner threads
    let strandWidth = w / fringeStrands;
    
    for (let i = 0; i < fringeStrands; i++) {
        let strandX = x + i * strandWidth;
        
        // Safety check for selectedPalette
        if (!selectedPalette || !selectedPalette.colors) {
            initializePalette();
        }
        
        let strandColor = random(selectedPalette.colors);
        
        // Draw individual fringe strand with thin threads
        for (let j = 0; j < 12; j++) { // More but thinner threads per strand
            let threadX = strandX + random(-strandWidth/6, strandWidth/6);
            let startY = side === 'top' ? y + h : y;
            let endY = side === 'top' ? y : y + h;
            
            // Add natural curl/wave to the fringe with more variation
            let waveAmplitude = random(1, 4);
            let waveFreq = random(0.2, 0.8);
            
            // Randomize the direction and intensity for each thread
            let direction = random([-1, 1]); // Random left or right direction
            let curlIntensity = random(0.5, 2.0);
            let threadLength = random(0.8, 1.2); // Vary thread length
            
            // Use darker version of strand color for fringe
            let fringeColor = color(strandColor);
            let r = red(fringeColor) * 0.7;
            let g = green(fringeColor) * 0.7;
            let b = blue(fringeColor) * 0.7;
            
            stroke(r, g, b);
            strokeWeight(random(0.5, 1.2)); // Vary thread thickness
            
            noFill();
            beginShape();
            for (let t = 0; t <= 1; t += 0.1) {
                let yPos = lerp(startY, endY, t * threadLength);
                let xOffset = sin(t * PI * waveFreq) * waveAmplitude * t * direction * curlIntensity;
                // Add more randomness and natural variation
                xOffset += random(-1, 1);
                // Add occasional kinks and bends
                if (random() < 0.3) {
                    xOffset += random(-2, 2);
                }
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
            updateTextColors();
            generateStripeData();
            redraw();
        };
    }
    
    // Call the function immediately if we're setting it up
    currentSeed = seed;
    randomSeed(seed);
    noiseSeed(seed);
    
    selectedPalette = random(colorPalettes);
    updateTextColors();
    generateStripeData();
    if (typeof redraw === 'function') {
        redraw();
    }
}



// Text embedding functions
function addTextToDoormatInSketch(textRows) {
    // Handle both single string and array of strings
    if (typeof textRows === 'string') {
        textRows = [textRows];
    }
    
    // Clean each text row
    doormatTextRows = textRows.map(text => 
        text.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, MAX_CHARS)
    ).filter(text => text.length > 0); // Remove empty rows
    
    generateTextData();
    redraw();
}

function clearTextFromDoormat() {
    doormatTextRows = [];
    textData = [];
    redraw();
}

function generateTextData() {
    textData = [];
    if (!doormatTextRows || doormatTextRows.length === 0) return;
    
    // Use actual thread spacing for text
    const warpSpacing = warpThickness + 1;
    const weftSpacing = weftThickness + 1;
    const scaledWarp = warpSpacing * TEXT_SCALE;
    const scaledWeft = weftSpacing * TEXT_SCALE;
    
    // Character dimensions based on thread spacing
    const charWidth = 7 * scaledWarp; // width after rotation (7 columns)
    const charHeight = 5 * scaledWeft; // height after rotation (5 rows)
    const spacing = scaledWeft; // vertical gap between stacked characters
    
    // Calculate spacing between rows (horizontal spacing after rotation)
    const rowSpacing = charWidth * 1.5; // Space between rows
    
    // Calculate total width needed for all rows
    const totalRowsWidth = doormatTextRows.length * charWidth + (doormatTextRows.length - 1) * rowSpacing;
    
    // Calculate starting X position to center all rows
    const baseStartX = (doormatWidth - totalRowsWidth) / 2;
    
    // Generate text data for each row
    for (let rowIndex = 0; rowIndex < doormatTextRows.length; rowIndex++) {
        const doormatText = doormatTextRows[rowIndex];
        if (!doormatText) continue;
        
        // Calculate text dimensions for this row
        const textWidth = charWidth;
        const textHeight = doormatText.length * (charHeight + spacing) - spacing;
        
        // Position for this row (left to right becomes after rotation)
        const startX = baseStartX + rowIndex * (charWidth + rowSpacing);
        const startY = (doormatHeight - textHeight) / 2;
        
        // Generate character data vertically bottom-to-top for this row
        for (let i = 0; i < doormatText.length; i++) {
            const char = doormatText.charAt(i);
            const charY = startY + (doormatText.length - 1 - i) * (charHeight + spacing);
            const charPixels = generateCharacterPixels(char, startX, charY, charWidth, charHeight);
            textData.push(...charPixels);
        }
    }
}

function generateCharacterPixels(char, x, y, width, height) {
    const pixels = [];
    // Use actual thread spacing
    const warpSpacing = warpThickness + 1;
    const weftSpacing = weftThickness + 1;
    const scaledWarp = warpSpacing * TEXT_SCALE;
    const scaledWeft = weftSpacing * TEXT_SCALE;

    // Character definitions (5x7 grid)
    const charMap = {
        'A': ["01110","10001","10001","11111","10001","10001","10001"],
        'B': ["11110","10001","10001","11110","10001","10001","11110"],
        'C': ["01111","10000","10000","10000","10000","10000","01111"],
        'D': ["11110","10001","10001","10001","10001","10001","11110"],
        'E': ["11111","10000","10000","11110","10000","10000","11111"],
        'F': ["11111","10000","10000","11110","10000","10000","10000"],
        'G': ["01111","10000","10000","10011","10001","10001","01111"],
        'H': ["10001","10001","10001","11111","10001","10001","10001"],
        'I': ["11111","00100","00100","00100","00100","00100","11111"],
        'J': ["11111","00001","00001","00001","00001","10001","01110"],
        'K': ["10001","10010","10100","11000","10100","10010","10001"],
        'L': ["10000","10000","10000","10000","10000","10000","11111"],
        'M': ["10001","11011","10101","10001","10001","10001","10001"],
        'N': ["10001","11001","10101","10011","10001","10001","10001"],
        'O': ["01110","10001","10001","10001","10001","10001","01110"],
        'P': ["11110","10001","10001","11110","10000","10000","10000"],
        'Q': ["01110","10001","10001","10001","10101","10010","01101"],
        'R': ["11110","10001","10001","11110","10100","10010","10001"],
        'S': ["01111","10000","10000","01110","00001","00001","11110"],
        'T': ["11111","00100","00100","00100","00100","00100","00100"],
        'U': ["10001","10001","10001","10001","10001","10001","01110"],
        'V': ["10001","10001","10001","10001","10001","01010","00100"],
        'W': ["10001","10001","10001","10001","10101","11011","10001"],
        'X': ["10001","10001","01010","00100","01010","10001","10001"],
        'Y': ["10001","10001","01010","00100","00100","00100","00100"],
        'Z': ["11111","00001","00010","00100","01000","10000","11111"],
        ' ': ["00000","00000","00000","00000","00000","00000","00000"],
        '0': ["01110","10001","10011","10101","11001","10001","01110"],
        '1': ["00100","01100","00100","00100","00100","00100","01110"],
        '2': ["01110","10001","00001","00010","00100","01000","11111"],
        '3': ["11110","00001","00001","01110","00001","00001","11110"],
        '4': ["00010","00110","01010","10010","11111","00010","00010"],
        '5': ["11111","10000","10000","11110","00001","00001","11110"],
        '6': ["01110","10000","10000","11110","10001","10001","01110"],
        '7': ["11111","00001","00010","00100","01000","01000","01000"],
        '8': ["01110","10001","10001","01110","10001","10001","01110"],
        '9': ["01110","10001","10001","01111","00001","00001","01110"]
    };
    
    const charDef = charMap[char] || charMap[' '];

    const numRows = charDef.length;
    const numCols = charDef[0].length;

    // Rotate 90° CCW: newX = col, newY = numRows - 1 - row
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (charDef[row][col] === '1') {
                // Rotate 180°: flip both axes
                const newCol = row;
                const newRow = numCols - 1 - col;
                pixels.push({
                    x: x + newCol * scaledWarp,
                    y: y + newRow * scaledWeft,
                    width: scaledWarp,
                    height: scaledWeft
                });
            }
        }
    }
    return pixels;
}

// Trait calculation functions
function calculateTraits() {
    const traits = {
        // Text traits
        textLines: doormatTextRows.length,
        totalCharacters: doormatTextRows.reduce((sum, row) => sum + row.length, 0),
        
        // Palette traits
        paletteName: selectedPalette ? selectedPalette.name : "Unknown",
        paletteRarity: getPaletteRarity(selectedPalette ? selectedPalette.name : ""),
        
        // Visual traits
        stripeCount: stripeData.length,
        stripeComplexity: calculateStripeComplexity()
    };
    
    console.log("Calculated traits:", traits);
    return traits;
}

function getPaletteRarity(paletteName) {
    // Define rarity tiers for different palette categories
    const legendaryPalettes = ["Indian Flag", "Buddhist", "Maurya Empire", "Chola Dynasty", "Indigo Famine", "Bengal Famine", "Jamakalam"];
    const epicPalettes = ["Peacock", "Flamingo", "Toucan", "Madras Checks", "Kanchipuram Silk", "Natural Dyes", "Bleeding Vintage"];
    const rarePalettes = ["Tamil Classical", "Sangam Era", "Pandya Dynasty", "Maratha Empire", "Rajasthani"];
    const uncommonPalettes = ["Tamil Nadu Temple", "Kerala Onam", "Chettinad Spice", "Chennai Monsoon", "Bengal Indigo"];
    
    if (legendaryPalettes.includes(paletteName)) return "Legendary";
    if (epicPalettes.includes(paletteName)) return "Epic";
    if (rarePalettes.includes(paletteName)) return "Rare";
    if (uncommonPalettes.includes(paletteName)) return "Uncommon";
    return "Common";
}

function calculateStripeComplexity() {
    if (!stripeData || stripeData.length === 0) return "Basic";
    
    let complexityScore = 0;
    let mixedCount = 0;
    let texturedCount = 0;
    let solidCount = 0;
    let secondaryColorCount = 0;
    
    // Count different pattern types
    for (let stripe of stripeData) {
        if (stripe.weaveType === 'mixed') {
            mixedCount++;
            complexityScore += 2; // Mixed weave adds more complexity
        } else if (stripe.weaveType === 'textured') {
            texturedCount++;
            complexityScore += 1.5; // Textured adds medium complexity
        } else {
            solidCount++;
            // Solid adds no complexity
        }
        
        if (stripe.secondaryColor) {
            secondaryColorCount++;
            complexityScore += 1; // Secondary colors add complexity
        }
    }
    
    // Calculate ratios
    const mixedRatio = mixedCount / stripeData.length;
    const texturedRatio = texturedCount / stripeData.length;
    const solidRatio = solidCount / stripeData.length;
    const secondaryRatio = secondaryColorCount / stripeData.length;
    
    // Normalize complexity score
    const normalizedComplexity = complexityScore / (stripeData.length * 3); // Max possible is 3 per stripe
    
    // Much more strict classification
    if (solidRatio > 0.9) return "Basic"; // Almost all solid
    if (solidRatio > 0.75 && normalizedComplexity < 0.15) return "Simple"; // Mostly solid with minimal complexity
    if (solidRatio > 0.6 && normalizedComplexity < 0.3) return "Moderate"; // Good amount of solid with some complexity
    if (normalizedComplexity < 0.5) return "Complex"; // Significant complexity
    return "Very Complex"; // High complexity
}

// Make the functions globally available
if (typeof window !== 'undefined') {
    window.addTextToDoormatInSketch = addTextToDoormatInSketch;
    window.clearTextFromDoormat = clearTextFromDoormat;
    window.getCurrentPalette = () => selectedPalette;
    window.calculateTraits = calculateTraits;
}
