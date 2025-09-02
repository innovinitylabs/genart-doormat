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

// Comprehensive Color Palettes - Global, Indian, Tamil Cultural, and Natural Dye inspired
const colorPalettes = [
    // ===== GLOBAL PALETTES (25) =====
    
    // Classic Red & Black - most common doormat colors
    {
        name: "Classic Red & Black",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#000000', '#2F2F2F', '#696969', '#8B4513', '#A0522D'
        ]
    },
    // Natural Jute & Hemp - eco-friendly doormat colors
    {
        name: "Natural Jute & Hemp",
        colors: [
            '#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#8B7355', '#A0522D', '#654321', '#2F2F2F'
        ]
    },
    // Coastal Blue & White - beach house style
    {
        name: "Coastal Blue & White",
        colors: [
            '#4682B4', '#5F9EA0', '#87CEEB', '#B0E0E6', '#F8F8FF', '#F0F8FF', '#E6E6FA', '#B0C4DE'
        ]
    },
    // Rustic Farmhouse - warm, earthy tones
    {
        name: "Rustic Farmhouse",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#F5DEB3', '#F4E4BC'
        ]
    },
    // Modern Gray & White - contemporary minimalist
    {
        name: "Modern Gray & White",
        colors: [
            '#F5F5F5', '#FFFFFF', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080', '#696969', '#2F2F2F'
        ]
    },
    // Autumn Harvest - warm fall colors
    {
        name: "Autumn Harvest",
        colors: [
            '#8B4513', '#D2691E', '#CD853F', '#F4A460', '#8B0000', '#B22222', '#FF8C00', '#FFA500'
        ]
    },
    // Spring Garden - fresh, vibrant colors
    {
        name: "Spring Garden",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#FF69B4', '#FFB6C1', '#87CEEB', '#F0E68C'
        ]
    },
    // Industrial Metal - urban, modern look
    {
        name: "Industrial Metal",
        colors: [
            '#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5F5', '#000000'
        ]
    },
    // Mediterranean - warm, sun-baked colors
    {
        name: "Mediterranean",
        colors: [
            '#FF6347', '#FF4500', '#FF8C00', '#FFA500', '#F4A460', '#DEB887', '#87CEEB', '#4682B4'
        ]
    },
    // Scandinavian - clean, light colors
    {
        name: "Scandinavian",
        colors: [
            '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057'
        ]
    },
    // Nordic Forest - deep greens and browns
    {
        name: "Nordic Forest",
        colors: [
            '#2D5016', '#3A5F0B', '#4A7C59', '#5D8B66', '#6B8E23', '#8FBC8F', '#9ACD32', '#ADFF2F'
        ]
    },
    // Desert Sunset - warm, sandy tones
    {
        name: "Desert Sunset",
        colors: [
            '#CD853F', '#DEB887', '#F4A460', '#D2B48C', '#BC8F8F', '#8B4513', '#A0522D', '#D2691E'
        ]
    },
    // Arctic Ice - cool, icy colors
    {
        name: "Arctic Ice",
        colors: [
            '#F0F8FF', '#E6E6FA', '#B0C4DE', '#87CEEB', '#B0E0E6', '#F0FFFF', '#E0FFFF', '#F5F5F5'
        ]
    },
    // Tropical Paradise - vibrant, warm colors
    {
        name: "Tropical Paradise",
        colors: [
            '#FF6347', '#FF4500', '#FF8C00', '#FFA500', '#32CD32', '#90EE90', '#98FB98', '#00CED1'
        ]
    },
    // Vintage Retro - muted, nostalgic colors
    {
        name: "Vintage Retro",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#8B7355', '#F5DEB3', '#F4E4BC'
        ]
    },
    // Art Deco - elegant, sophisticated colors
    {
        name: "Art Deco",
        colors: [
            '#000000', '#2F2F2F', '#696969', '#8B4513', '#A0522D', '#CD853F', '#F5DEB3', '#FFFFFF'
        ]
    },
    // Bohemian - eclectic, artistic colors
    {
        name: "Bohemian",
        colors: [
            '#8E44AD', '#9B59B6', '#E67E22', '#D35400', '#E74C3C', '#C0392B', '#16A085', '#1ABC9C'
        ]
    },
    // Minimalist - clean, simple colors
    {
        name: "Minimalist",
        colors: [
            '#FFFFFF', '#F5F5F5', '#E0E0E0', '#CCCCCC', '#999999', '#666666', '#333333', '#000000'
        ]
    },
    // Corporate - professional, business colors
    {
        name: "Corporate",
        colors: [
            '#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5F5', '#FFFFFF'
        ]
    },
    // Luxury - rich, premium colors
    {
        name: "Luxury",
        colors: [
            '#000000', '#2F2F2F', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F5DEB3', '#FFD700'
        ]
    },
    // Pastel Dreams - soft, gentle colors
    {
        name: "Pastel Dreams",
        colors: [
            '#FFB6C1', '#FFC0CB', '#FFE4E1', '#F0E68C', '#98FB98', '#90EE90', '#87CEEB', '#E6E6FA'
        ]
    },
    // Earth Tones - natural, organic colors
    {
        name: "Earth Tones",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Ocean Depths - deep, marine colors
    {
        name: "Ocean Depths",
        colors: [
            '#000080', '#191970', '#4169E1', '#4682B4', '#5F9EA0', '#87CEEB', '#B0E0E6', '#E0FFFF'
        ]
    },
    // Mountain Mist - cool, natural colors
    {
        name: "Mountain Mist",
        colors: [
            '#2F4F4F', '#4A5D6B', '#5F7A7A', '#6B8E8E', '#87CEEB', '#B0C4DE', '#E6E6FA', '#F0F8FF'
        ]
    },
    // Sunset Glow - warm, radiant colors
    {
        name: "Sunset Glow",
        colors: [
            '#FF6347', '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FF69B4', '#FF1493', '#DC143C'
        ]
    },
    
    // ===== INDIAN CULTURAL PALETTES (18) =====
    
    // Rajasthani - vibrant, royal colors
    {
        name: "Rajasthani",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Mughal - rich, imperial colors
    {
        name: "Mughal",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Kerala - coastal, tropical colors
    {
        name: "Kerala",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Gujarat - colorful, festive colors
    {
        name: "Gujarat",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Punjab - warm, harvest colors
    {
        name: "Punjab",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#8B0000', '#228B22', '#006400'
        ]
    },
    // Bengal - monsoon, lush colors
    {
        name: "Bengal",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Kashmir - cool, mountain colors
    {
        name: "Kashmir",
        colors: [
            '#87CEEB', '#B0E0E6', '#E0FFFF', '#F0F8FF', '#E6E6FA', '#B0C4DE', '#4682B4', '#000080'
        ]
    },
    // Maharashtra - earthy, warm colors
    {
        name: "Maharashtra",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Tamil Nadu - traditional, cultural colors
    {
        name: "Tamil Nadu",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Karnataka - forest, nature colors
    {
        name: "Karnataka",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8B4513', '#A0522D', '#CD853F', '#D2691E'
        ]
    },
    // Andhra Pradesh - coastal, vibrant colors
    {
        name: "Andhra Pradesh",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Telangana - modern, urban colors
    {
        name: "Telangana",
        colors: [
            '#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5F5', '#FFFFFF'
        ]
    },
    // Odisha - tribal, earthy colors
    {
        name: "Odisha",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Madhya Pradesh - central, balanced colors
    {
        name: "Madhya Pradesh",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8B4513', '#A0522D', '#CD853F', '#D2691E'
        ]
    },
    // Uttar Pradesh - northern, traditional colors
    {
        name: "Uttar Pradesh",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Bihar - eastern, cultural colors
    {
        name: "Bihar",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // West Bengal - eastern, artistic colors
    {
        name: "West Bengal",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Assam - northeastern, natural colors
    {
        name: "Assam",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8B4513', '#A0522D', '#CD853F', '#D2691E'
        ]
    },
    // Himachal Pradesh - mountain, cool colors
    {
        name: "Himachal Pradesh",
        colors: [
            '#87CEEB', '#B0E0E6', '#E0FFFF', '#F0F8FF', '#E6E6FA', '#B0C4DE', '#4682B4', '#000080'
        ]
    },
    
    // ===== TAMIL CULTURAL PALETTES (11) =====
    
    // Tamil Classical - traditional, ancient colors
    {
        name: "Tamil Classical",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Sangam Era - literary, cultural colors
    {
        name: "Sangam Era",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Chola Dynasty - royal, imperial colors
    {
        name: "Chola Dynasty",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Pandya Kingdom - southern, coastal colors
    {
        name: "Pandya Kingdom",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Chera Dynasty - western, trade colors
    {
        name: "Chera Dynasty",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Pallava Empire - architectural, stone colors
    {
        name: "Pallava Empire",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Vijayanagara - golden, prosperous colors
    {
        name: "Vijayanagara",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#8B0000', '#228B22', '#006400'
        ]
    },
    // Nayak Dynasty - artistic, temple colors
    {
        name: "Nayak Dynasty",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Maratha Rule - warrior, strong colors
    {
        name: "Maratha Rule",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // British Colonial - mixed, hybrid colors
    {
        name: "British Colonial",
        colors: [
            '#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5F5', '#FFFFFF'
        ]
    },
    // Modern Tamil - contemporary, urban colors
    {
        name: "Modern Tamil",
        colors: [
            '#2F4F4F', '#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#F5F5F5', '#FFFFFF'
        ]
    },
    
    // ===== NATURAL DYE PALETTES (8) =====
    
    // Indigo Dye - deep blue, natural colors
    {
        name: "Indigo Dye",
        colors: [
            '#000080', '#191970', '#4169E1', '#4682B4', '#5F9EA0', '#87CEEB', '#B0E0E6', '#E0FFFF'
        ]
    },
    // Madder Root - red, earthy colors
    {
        name: "Madder Root",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF6347', '#CD5C5C', '#F08080', '#FA8072'
        ]
    },
    // Turmeric - golden, warm colors
    {
        name: "Turmeric",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#DAA520', '#B8860B', '#CD853F'
        ]
    },
    // Henna - reddish-brown, natural colors
    {
        name: "Henna",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Pomegranate - deep red, rich colors
    {
        name: "Pomegranate",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF6347', '#CD5C5C', '#F08080', '#FA8072'
        ]
    },
    // Neem - green, natural colors
    {
        name: "Neem",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8B4513', '#A0522D', '#CD853F', '#D2691E'
        ]
    },
    // Saffron - golden, precious colors
    {
        name: "Saffron",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#DAA520', '#B8860B', '#CD853F'
        ]
    },
    // Marigold - bright, cheerful colors
    {
        name: "Marigold",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#FF1493', '#FF69B4', '#FFB6C1'
        ]
    },
    
    // ===== MADRAS CHECKS & TAMIL NADU INSPIRED PALETTES (8) =====
    
    // Madras Checks - traditional plaid colors
    {
        name: "Madras Checks",
        colors: [
            '#8B0000', '#DC143C', '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Tamil Nadu Temple - sacred, vibrant colors
    {
        name: "Tamil Nadu Temple",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Kanchipuram Silk - luxurious, traditional colors
    {
        name: "Kanchipuram Silk",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Thanjavur Art - classical, artistic colors
    {
        name: "Thanjavur Art",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#8B0000', '#228B22', '#006400'
        ]
    },
    // Chettinad Architecture - heritage, warm colors
    {
        name: "Chettinad Architecture",
        colors: [
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'
        ]
    },
    // Madurai Meenakshi - divine, colorful palette
    {
        name: "Madurai Meenakshi",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#FF1493', '#8B0000', '#4B0082', '#000080'
        ]
    },
    // Coimbatore Cotton - natural, earthy colors
    {
        name: "Coimbatore Cotton",
        colors: [
            '#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#8B7355', '#A0522D', '#654321', '#2F2F2F'
        ]
    },
    // Salem Silk - traditional, refined colors
    {
        name: "Salem Silk",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    
    // ===== WESTERN GHATS BIRDS PALETTES (6) =====
    
    // Indian Peacock - majestic, iridescent colors
    {
        name: "Indian Peacock",
        colors: [
            '#000080', '#191970', '#4169E1', '#4682B4', '#00CED1', '#40E0D0', '#48D1CC', '#20B2AA'
        ]
    },
    // Flamingo - tropical, pink-orange colors
    {
        name: "Flamingo",
        colors: [
            '#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FF6347', '#FF4500', '#FF8C00', '#FFA500'
        ]
    },
    // Toucan - vibrant, tropical colors
    {
        name: "Toucan",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#000000', '#FFFFFF', '#FF1493'
        ]
    },
    // Malabar Trogon - forest, jewel colors
    {
        name: "Malabar Trogon",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Nilgiri Flycatcher - mountain, cool colors
    {
        name: "Nilgiri Flycatcher",
        colors: [
            '#87CEEB', '#B0E0E6', '#E0FFFF', '#F0F8FF', '#E6E6FA', '#B0C4DE', '#4682B4', '#000080'
        ]
    },
    // Malabar Parakeet - forest, green colors
    {
        name: "Malabar Parakeet",
        colors: [
            '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8B4513', '#A0522D', '#CD853F', '#D2691E'
        ]
    },
    
    // ===== HISTORICAL DYNASTY & CULTURAL PALETTES (4) =====
    
    // Pandya Dynasty - southern, maritime colors
    {
        name: "Pandya Dynasty",
        colors: [
            '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#00CED1', '#87CEEB', '#4682B4', '#000080'
        ]
    },
    // Maratha Empire - warrior, strong colors
    {
        name: "Maratha Empire",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Maurya Empire - imperial, ancient colors
    {
        name: "Maurya Empire",
        colors: [
            '#8B0000', '#DC143C', '#B22222', '#FF4500', '#FF8C00', '#FFD700', '#228B22', '#006400'
        ]
    },
    // Buddhist - peaceful, spiritual colors
    {
        name: "Buddhist",
        colors: [
            '#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#228B22', '#32CD32', '#90EE90', '#98FB98'
        ]
    }
];

let selectedPalette;
let stripeData = [];
let doormatTextRows = []; // Array of text rows to embed in the doormat
let textData = []; // Text positioning and character data

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
    
    // Set random warp thickness between 1 and 2
    warpThickness = random([1, 2]);
    
    // Select random palette
    selectedPalette = random(colorPalettes);
    updateTextColors();
    
    // Generate stripe data
    generateStripeData();
    
    // Redraw the doormat
    redraw();
}

function generateStripeData() {
    stripeData = [];
    let totalHeight = doormatHeight;
    let currentY = 0;
    
    // Safety check for selectedPalette
    if (!selectedPalette || !selectedPalette.colors) {
        initializePalette();
    }
    
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

// Make the functions globally available
if (typeof window !== 'undefined') {
    window.addTextToDoormatInSketch = addTextToDoormatInSketch;
    window.clearTextFromDoormat = clearTextFromDoormat;
    window.getCurrentPalette = () => selectedPalette;
}
