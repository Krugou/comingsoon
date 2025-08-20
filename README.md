# Coming Soon - NodeCG Bundle

A 3D interactive "Coming Soon" page featuring text that explodes when clicked, tapped, or when a key is pressed. Now available as both a NodeCG bundle with remote control capabilities and a standalone HTML page.

## Features

- 3D rendered text with Three.js
- Exploding text animation on interaction
- Particle background effects
- Mobile-friendly design
- Customizable text, colors, and animation settings
- Fallback display for browsers without WebGL support
- **NodeCG Integration** with remote control dashboard
- **Standalone HTML** for quick preview and testing

## Installation & Setup

### Quick Start with NodeCG

The easiest way to get started is to run NodeCG directly from this repository:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start NodeCG:**

   ```bash
   npm start
   ```

3. **Access the graphics:**
   - Graphics: `http://localhost:9090/bundles/comingsoon/graphics/`
   - NodeCG Dashboard: `http://localhost:9090/dashboard/`

This automatically sets up a local NodeCG instance with the comingsoon bundle ready to use.

> **Note:** The current quick-start setup includes graphics functionality. Dashboard panels are available when using an existing NodeCG installation due to file path resolution requirements.

### For Existing NodeCG Installation

If you have an existing NodeCG installation and want to add this as a bundle:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Copy this bundle to your NodeCG bundles directory:**

   ```bash
   # Assuming NodeCG is installed and bundles directory exists
   cp -r /path/to/this/bundle /path/to/nodecg/bundles/comingsoon
   ```

3. **Start NodeCG:**

   ```bash
   # From your NodeCG installation directory
   npm start
   ```

4. **Access the graphics and dashboard:**
   - Graphics: `http://localhost:9090/bundles/comingsoon/graphics/`
   - Dashboard: `http://localhost:9090/dashboard/`

### For Standalone Use

1. **Start the development server:**

   ```bash
   npm run standalone
   ```

2. **Open in browser:**

   ```
   http://localhost:8000/examples/
   ```

## NodeCG Features

### Dashboard Controls

The NodeCG dashboard provides real-time control over:

- **Quick Actions:** Trigger text explosion remotely
- **Text Content:** Change title, subtitle, and attribution text
- **Colors:** Adjust text colors with color pickers
- **Sizes:** Control text sizes with sliders
- **Animation:** Modify explosion duration and strength

### Remote Control API

The bundle exposes REST API endpoints for external control:

- `GET /api/coming-soon/config` - Get current configuration
- `POST /api/coming-soon/config` - Update configuration
- `POST /api/coming-soon/explode` - Trigger explosion

### Replicants

The bundle uses two NodeCG replicants:

- `sceneConfig` - Stores current scene configuration
- `triggerExplosion` - Triggers explosion animations

## Standalone Customization

### URL Parameters

You can customize the standalone version using URL parameters:

#### Text Content

- `title` - Main title text (default: "EXAMPLE SITE")
- `subtitle` - Subtitle text (default: "COMING SOON 2025")
- `attribution` - Attribution text (default: "Example Company & Partner Organization")

#### Text Appearance

- `titleColor` - Hex color for the title (default: "fb7aae")
- `subtitleColor` - Hex color for the subtitle (default: "f7fafc")
- `attributionColor` - Hex color for the attribution (default: "637786")
- `titleSize` - Size of the title text (default: 1.2)
- `subtitleSize` - Size of the subtitle text (default: 0.8)
- `attributionSize` - Size of the attribution text (default: 0.4)
- `titleY` - Vertical position of the title (default: 3)
- `subtitleY` - Vertical position of the subtitle (default: -2)
- `attributionY` - Vertical position of the attribution (default: -5.5)

#### Background and Particles

- `bgColor` - Hex color for the background (default: "242D38")
- `particleCount` - Number of particles (default: 1000)
- `particleColor` - Hex color for particles (default: "f7fafc")
- `particleSize` - Size of particles (default: 0.1)
- `particleOpacity` - Opacity of particles (default: 0.6)

#### Animation Settings

- `explosionDuration` - Duration of explosion in milliseconds (default: 6000)
- `explosionStrength` - Strength of explosion effect (default: 15)
- `rotationStrength` - Strength of rotation during explosion (default: 3)

### Examples

#### Basic Text Changes

```
examples/index.html?title=WELCOME&subtitle=OPENING SOON
```

#### Custom Colors

```
examples/index.html?titleColor=ff0000&subtitleColor=00ff00&bgColor=000000
```

#### Complete Customization

```
examples/index.html?title=CUSTOM TITLE&subtitle=LAUNCHING FALL 2025&attribution=A project by Example Team&titleColor=00ff00&subtitleColor=0000ff&attributionColor=ff00ff&bgColor=111111&titleSize=1.5&subtitleSize=0.9&attributionSize=0.5&titleY=4&subtitleY=-1&attributionY=-6&particleCount=2000&particleColor=00ffff&particleSize=0.15&explosionStrength=20&explosionDuration=5000&rotationStrength=4
```

## Development

### Building

```bash
npm run build
```

This creates production-ready files in the `dist/` directory.

### File Structure

```
├── package.json           # Dependencies and scripts
├── nodecg.json           # NodeCG bundle configuration
├── vite.config.js        # Build configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── extension/            # NodeCG server-side code
│   └── index.js
├── graphics/             # NodeCG graphics (browser source)
│   └── index.html
├── dashboard/            # NodeCG dashboard panels
│   └── controls.html
├── shared/               # Shared code modules
│   ├── scene.js         # Three.js scene class
│   └── utils.js         # Utility functions
├── examples/             # Standalone HTML version
│   └── index.html       # Original standalone page
└── dist/                 # Built files (generated)
```

### Technology Stack

- **Three.js** for 3D rendering
- **NodeCG** for broadcast graphics integration
- **Vite** for building and development
- **Tailwind CSS** for styling
- **ES6 Modules** for code organization

## Browser Compatibility

The page requires WebGL support. For browsers without WebGL capabilities, a fallback static version is displayed automatically.

## Contributing

This bundle is designed to be easily extensible. The modular structure allows for:

- Adding new animation types
- Extending the dashboard controls
- Creating additional graphics layouts
- Integrating with external APIs
