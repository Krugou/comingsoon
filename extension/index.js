module.exports = function (nodecg) {
  // Initialize replicants with default values
  const sceneConfig = nodecg.Replicant('sceneConfig', {
    defaultValue: {
      title: {
        text: "EXAMPLE SITE",
        color: 0xfb7aae,
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
    }
  });

  const triggerExplosion = nodecg.Replicant('triggerExplosion', {
    defaultValue: { trigger: false }
  });

  // Log when the extension is loaded
  nodecg.log.info('Coming Soon NodeCG bundle loaded successfully');

  // Listen for configuration changes
  sceneConfig.on('change', (newValue, oldValue) => {
    if (newValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      nodecg.log.info('Scene configuration updated');
    }
  });

  // Listen for explosion triggers
  triggerExplosion.on('change', (newValue) => {
    if (newValue && newValue.trigger) {
      nodecg.log.info('Text explosion triggered remotely');
    }
  });

  // Optional: Add API endpoints for external control
  nodecg.mount('/api/coming-soon', require('express').Router()
    .get('/config', (req, res) => {
      res.json(sceneConfig.value);
    })
    .post('/config', (req, res) => {
      try {
        sceneConfig.value = { ...sceneConfig.value, ...req.body };
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    })
    .post('/explode', (req, res) => {
      triggerExplosion.value = { trigger: true };
      res.json({ success: true });
    })
  );
};