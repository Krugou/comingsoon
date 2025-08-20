import * as THREE from 'three';

// Error handling class
class SceneError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SceneError';
  }
}

/**
 * ComingSoonScene - A reusable Three.js scene for the coming soon page
 */
export class ComingSoonScene {
  constructor(container, config = {}) {
    this.container = container;
    this.config = this.mergeConfig(config);

    // Scene components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.textGroups = [];
    this.textMeshes = [];
    this.particles = null;
    this.animationId = null;
    this.clock = new THREE.Clock();

    // Animation state
    this.animState = {
      exploding: false,
      startTime: 0,
      duration: this.config.animation.explosionDuration,
      meshes: [],
      originalPositions: [],
      originalRotations: []
    };

    // Event handlers
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.animate = this.animate.bind(this);
  }

  mergeConfig(userConfig) {
    const defaultConfig = {
      title: {
        text: "EXAMPLE SITE",
        color: 0x002ea2,
        size: 1.2,
        yPos: 3
      },
      subtitle: {
        text: "COMING SOON 2025",
        color: 0xf7fafc,
        size: 0.8,
        yPos: -2
      },
      attribution: {
        text: "Example Company & Partner Organization",
        color: 0x637786,
        size: 0.4,
        yPos: -5.5
      },
      background: {
        color: 0x242D38,
        particleCount: 1000,
        particleColor: 0xf7fafc,
        particleSize: 0.1,
        particleOpacity: 0.6
      },
      animation: {
        explosionDuration: 6000,
        explosionStrength: 15,
        rotationStrength: 3
      }
    };

    return this.deepMerge(defaultConfig, userConfig);
  }

  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  async init() {
    try {
      // Create scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.config.background.color);

      // Create camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 20;

      // Create renderer
      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: 'high-performance'
        });

        if (!this.renderer) throw new SceneError('WebGL renderer creation failed');

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Add renderer to DOM
        this.container.appendChild(this.renderer.domElement);
      } catch (error) {
        console.error('Renderer creation failed:', error);
        throw new SceneError('WebGL not supported or renderer creation failed');
      }

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);

      // Add accent light for better text visibility
      const accentLight = new THREE.PointLight(0x002ea2, 0.8);
      accentLight.position.set(0, 0, 10);
      this.scene.add(accentLight);

      // Create particle background
      this.createParticles();

      // Create text with TextGeometry
      await this.createText();

      // Event listeners
      window.addEventListener('resize', this.handleResize);
      this.renderer.domElement.addEventListener('click', this.handleClick);
      this.renderer.domElement.addEventListener('touchstart', this.handleClick);
      window.addEventListener('keydown', this.handleKeydown);

      // Start animation loop
      this.animate(0);

      return true;
    } catch (error) {
      console.error("Error initializing scene:", error);
      throw error;
    }
  }

  createParticles() {
    const particleCount = this.config.background.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: this.config.background.particleColor,
      size: this.config.background.particleSize,
      transparent: true,
      opacity: this.config.background.particleOpacity
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  async createText() {
    try {
      // Create title
      const title = await this.createTextGeometry(
        this.config.title.text,
        this.config.title.color,
        this.config.title.size,
        this.config.title.yPos
      );
      this.textGroups.push(title.group);
      if (title.textMesh) this.textMeshes.push(title.textMesh);

      // Create subtitle
      const subtitle = await this.createTextGeometry(
        this.config.subtitle.text,
        this.config.subtitle.color,
        this.config.subtitle.size,
        this.config.subtitle.yPos
      );
      this.textGroups.push(subtitle.group);
      if (subtitle.textMesh) this.textMeshes.push(subtitle.textMesh);

      // Create attribution
      const attribution = await this.createTextGeometry(
        this.config.attribution.text,
        this.config.attribution.color,
        this.config.attribution.size,
        this.config.attribution.yPos
      );
      this.textGroups.push(attribution.group);
      if (attribution.textMesh) this.textMeshes.push(attribution.textMesh);

      // Add all meshes to animation state
      this.animState.meshes = [
        ...title.meshes,
        ...subtitle.meshes,
        ...attribution.meshes
      ];

      // Save original positions for explosion animation
      this.saveOriginalPositions();
    } catch (error) {
      console.error("Error creating text:", error);
      throw error;
    }
  }

  async createTextGeometry(text, color, size, yPos) {
    // For this implementation, we'll use box geometries as a fallback
    // In a real implementation, you'd load fonts and use TextGeometry
    const group = new THREE.Group();
    const meshes = [];

    const spacing = size * 1.2;
    let xPos = -(text.length * spacing) / 2;

    const material = new THREE.MeshLambertMaterial({ color: color });

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === ' ') {
        xPos += spacing;
        continue;
      }

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size * 0.5),
        material.clone()
      );

      cube.position.set(xPos, yPos, 0);
      cube.userData = {
        isLetter: true,
        originalPosition: { x: xPos, y: yPos, z: 0 },
        originalRotation: { x: 0, y: 0, z: 0 }
      };

      group.add(cube);
      meshes.push(cube);
      xPos += spacing;
    }

    this.scene.add(group);
    return { group, meshes, textMesh: null };
  }

  saveOriginalPositions() {
    this.animState.originalPositions = [];
    this.animState.originalRotations = [];

    this.animState.meshes.forEach(mesh => {
      this.animState.originalPositions.push({
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      });
      this.animState.originalRotations.push({
        x: mesh.rotation.x,
        y: mesh.rotation.y,
        z: mesh.rotation.z
      });
    });
  }

  triggerExplosion() {
    if (this.animState.exploding) return;

    this.animState.exploding = true;
    this.animState.startTime = this.clock.getElapsedTime() * 1000;
    this.animState.duration = this.config.animation.explosionDuration;
  }

  animate(timestamp) {
    this.animationId = requestAnimationFrame(this.animate);

    // Update particles
    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }

    // Handle explosion animation
    if (this.animState.exploding) {
      const currentTime = this.clock.getElapsedTime() * 1000;
      const elapsed = currentTime - this.animState.startTime;
      const progress = Math.min(elapsed / this.animState.duration, 1);

      if (progress >= 1) {
        // Reset explosion
        this.animState.exploding = false;
        this.textGroups.forEach(group => {
          group.position.set(0, 0, 0);
          group.rotation.set(0, 0, 0);
        });
      } else {
        // Animate explosion
        this.animState.meshes.forEach((mesh, index) => {
          const original = this.animState.originalPositions[index];
          const strength = this.config.animation.explosionStrength;
          const rotation = this.config.animation.rotationStrength;

          const randomX = (Math.random() - 0.5) * strength * progress;
          const randomY = (Math.random() - 0.5) * strength * progress;
          const randomZ = (Math.random() - 0.5) * strength * progress;

          mesh.position.set(
            original.x + randomX,
            original.y + randomY,
            original.z + randomZ
          );

          mesh.rotation.set(
            Math.random() * rotation * progress,
            Math.random() * rotation * progress,
            Math.random() * rotation * progress
          );
        });
      }
    }

    // Render scene
    if (this.renderer && this.scene && this.camera) {
      try {
        this.renderer.render(this.scene, this.camera);
      } catch (error) {
        console.error("Render error:", error);
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  handleResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  handleClick(event) {
    event.preventDefault();
    this.triggerExplosion();
  }

  handleKeydown(event) {
    this.triggerExplosion();
  }

  updateConfig(newConfig) {
    this.config = this.mergeConfig(newConfig);
    this.animState.duration = this.config.animation.explosionDuration;

    // Update scene background
    if (this.scene) {
      this.scene.background = new THREE.Color(this.config.background.color);
    }
  }

  dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);

    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeydown);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('click', this.handleClick);
      this.renderer.domElement.removeEventListener('touchstart', this.handleClick);
    }

    // Dispose of geometries and materials
    if (this.scene) {
      this.scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
