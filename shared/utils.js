/**
 * Utility functions for parsing URL parameters and configuration
 */

/**
 * Parse URL parameters into a configuration object
 * @returns {Object} Configuration object
 */
export function parseUrlConfig() {
  const params = new URLSearchParams(window.location.search);
  const config = {};

  // Helper function to safely parse hex colors
  const parseColor = (colorStr) => {
    if (!colorStr) return null;
    const cleanColor = colorStr.replace('#', '');
    const parsed = parseInt(cleanColor, 16);
    return isNaN(parsed) ? null : parsed;
  };

  // Helper function to safely parse numbers
  const parseNumber = (numStr, defaultValue) => {
    if (!numStr) return defaultValue;
    const parsed = parseFloat(numStr);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Text content
  if (params.get('title')) {
    config.title = { text: params.get('title') };
  }
  if (params.get('subtitle')) {
    config.subtitle = { text: params.get('subtitle') };
  }
  if (params.get('attribution')) {
    config.attribution = { text: params.get('attribution') };
  }

  // Text colors
  const titleColor = parseColor(params.get('titleColor'));
  if (titleColor !== null) {
    config.title = { ...config.title, color: titleColor };
  }

  const subtitleColor = parseColor(params.get('subtitleColor'));
  if (subtitleColor !== null) {
    config.subtitle = { ...config.subtitle, color: subtitleColor };
  }

  const attributionColor = parseColor(params.get('attributionColor'));
  if (attributionColor !== null) {
    config.attribution = { ...config.attribution, color: attributionColor };
  }

  // Text sizes
  const titleSize = parseNumber(params.get('titleSize'));
  if (titleSize !== undefined) {
    config.title = { ...config.title, size: titleSize };
  }

  const subtitleSize = parseNumber(params.get('subtitleSize'));
  if (subtitleSize !== undefined) {
    config.subtitle = { ...config.subtitle, size: subtitleSize };
  }

  const attributionSize = parseNumber(params.get('attributionSize'));
  if (attributionSize !== undefined) {
    config.attribution = { ...config.attribution, size: attributionSize };
  }

  // Text positions
  const titleY = parseNumber(params.get('titleY'));
  if (titleY !== undefined) {
    config.title = { ...config.title, yPos: titleY };
  }

  const subtitleY = parseNumber(params.get('subtitleY'));
  if (subtitleY !== undefined) {
    config.subtitle = { ...config.subtitle, yPos: subtitleY };
  }

  const attributionY = parseNumber(params.get('attributionY'));
  if (attributionY !== undefined) {
    config.attribution = { ...config.attribution, yPos: attributionY };
  }

  // Background settings
  const bgColor = parseColor(params.get('bgColor'));
  if (bgColor !== null) {
    config.background = { color: bgColor };
  }

  const particleCount = parseNumber(params.get('particleCount'));
  if (particleCount !== undefined) {
    config.background = { ...config.background, particleCount };
  }

  const particleColor = parseColor(params.get('particleColor'));
  if (particleColor !== null) {
    config.background = { ...config.background, particleColor };
  }

  const particleSize = parseNumber(params.get('particleSize'));
  if (particleSize !== undefined) {
    config.background = { ...config.background, particleSize };
  }

  const particleOpacity = parseNumber(params.get('particleOpacity'));
  if (particleOpacity !== undefined) {
    config.background = { ...config.background, particleOpacity };
  }

  // Animation settings
  const explosionDuration = parseNumber(params.get('explosionDuration'));
  if (explosionDuration !== undefined) {
    config.animation = { explosionDuration };
  }

  const explosionStrength = parseNumber(params.get('explosionStrength'));
  if (explosionStrength !== undefined) {
    config.animation = { ...config.animation, explosionStrength };
  }

  const rotationStrength = parseNumber(params.get('rotationStrength'));
  if (rotationStrength !== undefined) {
    config.animation = { ...config.animation, rotationStrength };
  }

  return config;
}

/**
 * Display fallback content for browsers without WebGL
 * @param {Object} config - Configuration object
 */
export function showFallback(config) {
  const container = document.getElementById('scene-container');
  const fallback = document.getElementById('fallback-container');

  if (container) container.style.display = 'none';
  if (fallback) fallback.style.display = 'flex';

  // Update fallback content
  const titleEl = document.getElementById('fallback-title');
  const subtitleEl = document.getElementById('fallback-subtitle');
  const attributionEl = document.getElementById('fallback-attribution');

  if (titleEl && config.title) {
    titleEl.textContent = config.title.text;
    if (config.title.color !== undefined) {
      titleEl.style.color = '#' + config.title.color.toString(16).padStart(6, '0');
    }
  }

  if (subtitleEl && config.subtitle) {
    subtitleEl.textContent = config.subtitle.text;
    if (config.subtitle.color !== undefined) {
      subtitleEl.style.color = '#' + config.subtitle.color.toString(16).padStart(6, '0');
    }
  }

  if (attributionEl && config.attribution) {
    attributionEl.textContent = config.attribution.text;
    if (config.attribution.color !== undefined) {
      attributionEl.style.color = '#' + config.attribution.color.toString(16).padStart(6, '0');
    }
  }

  // Update body background color
  if (config.background && config.background.color !== undefined) {
    document.body.style.backgroundColor =
      '#' + config.background.color.toString(16).padStart(6, '0');
  }
}
