module.exports = function (nodecg) {
  nodecg.log.info('[comingsoon] Extension initializing');

  const sceneConfig = nodecg.Replicant('sceneConfig', {
    persistent: true,
    default: {
      title: { text: 'EXAMPLE SITE', color: 0x002ea2, size: 1.2, yPos: 3, enabled: true },
      subtitle: { text: 'COMING SOON 2025', color: 0xf7fafc, size: 0.8, yPos: -2, enabled: true },
      attribution: {
        text: 'Example Company & Partner Organization',
        color: 0x637786,
        size: 0.4,
        yPos: -5.5,
        enabled: true,
      },
      background: {
        color: 0x242d38,
        particleCount: 1000,
        particleColor: 0xf7fafc,
        particleSize: 0.1,
        particleOpacity: 0.6,
      },
      animation: {
        explosionDuration: 6000,
        explosionStrength: 15,
        rotationStrength: 3,
      },
    },
  });

  const sceneAction = nodecg.Replicant('sceneAction', {
    persistent: false,
    default: { lastExplode: 0 },
  });

  // Add replicant for chyron (dashboard + graphic)
  const nameTagChyron = nodecg.Replicant('nameTagChyron', {
    persistent: true,
    default: {
      name: 'John Smith',
      title: 'Software Engineer',
      company: 'Tech Corporation',
      visible: false,
      animation: 'slide-in',
    },
  });

  nodecg.listenFor('explodeScene', (data, ack) => {
    sceneAction.value = { lastExplode: Date.now() };
    nodecg.log.info('[comingsoon] Explosion trigger sent');
    if (ack && !ack.handled) ack(null, { ok: true });
  });

  nodecg.listenFor('updateSceneConfig', (patch, ack) => {
    try {
      sceneConfig.value = { ...sceneConfig.value, ...patch };
      nodecg.log.info('[comingsoon] sceneConfig updated');
      if (ack && !ack.handled) ack(null, { ok: true });
    } catch (e) {
      nodecg.log.error(e);
      if (ack && !ack.handled) ack(e);
    }
  });

  // Optional: message to toggle visibility
  nodecg.listenFor('toggleChyron', (data, ack) => {
    nameTagChyron.value = {
      ...nameTagChyron.value,
      visible: data?.visible ?? !nameTagChyron.value.visible,
    };
    if (ack && !ack.handled) ack(null, { ok: true });
  });

  nodecg.log.info('[comingsoon] Extension ready');
};
