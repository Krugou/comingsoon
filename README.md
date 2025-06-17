# Example Site - Coming Soon

A 3D interactive "Coming Soon" page featuring text that explodes when clicked, tapped, or when a key is pressed.

## Features

- 3D rendered text with TextGeometry
- Exploding text animation on interaction
- Particle background
- Mobile-friendly design
- Customizable text, colors, and animation settings
- Fallback display for browsers without WebGL support

## Customization via URL Parameters

You can customize almost every aspect of the page by adding parameters to the URL. The following parameters are supported:

### Text Content

- `title` - Main title text (default: "EXAMPLE SITE")
- `subtitle` - Subtitle text (default: "COMING SOON 2025")
- `attribution` - Attribution text (default: "Example Company & Partner Organization")

### Text Appearance

- `titleColor` - Hex color for the title (default: "fb7aae")
- `subtitleColor` - Hex color for the subtitle (default: "f7fafc")
- `attributionColor` - Hex color for the attribution (default: "637786")
- `titleSize` - Size of the title text (default: 1.2)
- `subtitleSize` - Size of the subtitle text (default: 0.8)
- `attributionSize` - Size of the attribution text (default: 0.4)
- `titleY` - Vertical position of the title (default: 3)
- `subtitleY` - Vertical position of the subtitle (default: -2)
- `attributionY` - Vertical position of the attribution (default: -5.5)

### Background and Particles

- `bgColor` - Hex color for the background (default: "242D38")
- `particleCount` - Number of particles (default: 1000)
- `particleColor` - Hex color for particles (default: "f7fafc")
- `particleSize` - Size of particles (default: 0.1)
- `particleOpacity` - Opacity of particles (default: 0.6)

### Animation Settings

- `explosionDuration` - Duration of explosion in milliseconds (default: 6000)
- `explosionStrength` - Strength of explosion effect (default: 15)
- `rotationStrength` - Strength of rotation during explosion (default: 3)

## Examples

### Basic Text Changes

```
index.html?title=WELCOME&subtitle=OPENING SOON
```

### Custom Colors

```
index.html?titleColor=ff0000&subtitleColor=00ff00&bgColor=000000
```

### Adjust Sizes and Positions

```
index.html?titleSize=2&titleY=5&subtitleY=-3
```

### Explosion Parameters

```
index.html?explosionStrength=25&explosionDuration=8000
```

### Complete Customization Example

```
index.html?title=CUSTOM TITLE&subtitle=LAUNCHING FALL 2025&attribution=A project by Example Team&titleColor=00ff00&subtitleColor=0000ff&attributionColor=ff00ff&bgColor=111111&titleSize=1.5&subtitleSize=0.9&attributionSize=0.5&titleY=4&subtitleY=-1&attributionY=-6&particleCount=2000&particleColor=00ffff&particleSize=0.15&explosionStrength=20&explosionDuration=5000&rotationStrength=4
```

## Browser Compatibility

The page requires WebGL support. For browsers without WebGL capabilities, a fallback static version is displayed automatically.

## Development

This project uses:

- Three.js for 3D rendering
- TextGeometry for 3D text
- Tailwind CSS for styling
- Vanilla JavaScript for interaction
