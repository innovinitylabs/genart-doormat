# Generative Doormat Art

A P5.js generative art piece inspired by traditional woven doormats with horizontal stripes, varied textures, and fringe details.

## Features

🎨 **Multiple Color Palettes**: 
- Earthy (browns, tans, beiges)
- Traditional (reds, greens, blues, golds)
- Ocean (cyans, blues, teals)
- Sunset (oranges, reds, yellows)

🧵 **Realistic Weaving Simulation**:
- Individual warp and weft thread rendering
- Three weave types: solid, mixed, and textured
- Random color variations to simulate fabric irregularities
- Subtle shadows and highlights

🎯 **Stripe Patterns**:
- Random stripe heights (8-40 pixels)
- Primary and secondary color blending
- Noise-based texture variations

🌾 **Authentic Fringe**:
- Curved, flowing fringe strands at top and bottom
- Multiple threads per strand for realistic appearance
- Natural wave patterns and irregularities

⚡ **PRNG (Pseudo Random Number Generator)**:
- Reproducible results using seed values
- Same seed always generates identical doormat
- Perfect for sharing and archiving designs

## How to Use

1. Open `index.html` in a web browser
2. **Generate New Doormat**: Creates a random pattern
3. **Use Seed**: Enter a number to generate reproducible results
4. **Save as Image**: Download your creation as a PNG file

## Technical Details

- **Canvas Size**: 660x460 pixels (600x400 doormat + 30px fringe on each side)
- **Weave Resolution**: 4x3 pixel warp/weft intersections
- **Color Palettes**: 4 carefully curated palettes with 8 colors each
- **Fringe**: Procedurally generated with natural wave patterns

## File Structure

```
/Doormat/
├── index.html          # Main HTML page with controls
├── doormat.js          # P5.js sketch with generation logic
└── README.md          # This file
```

## Inspiration

Based on traditional woven rag rugs and doormats, this piece captures:
- The horizontal stripe patterns common in woven textiles
- The natural color variations found in handmade fabrics
- The frayed, flowing fringe typical of traditional rugs
- The slightly irregular texture of hand-woven materials

## Examples

Try these seeds for interesting patterns:
- **42**: Default earthy pattern
- **123**: Vibrant traditional colors
- **999**: Ocean-inspired blues and greens
- **777**: Sunset warmth

Enjoy creating your unique generative doormats! 🏠✨
