const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { spawn } = require('child_process');

(async () => {
  const rootDir = path.resolve(__dirname, '..');
  const instanceDir = path.join(rootDir, 'nodecg-instance');
  const bundlesDir = path.join(instanceDir, 'bundles');
  const bundleName = 'comingsoon';
  const bundleLink = path.join(bundlesDir, bundleName);
  const port = process.env.PORT || 9090;

  const log = (m) => console.log(`[nodecg] ${m}`);

  await fsp.mkdir(bundlesDir, { recursive: true });

  const instancePkg = path.join(instanceDir, 'package.json');
  if (!fs.existsSync(instancePkg)) {
    log('Creating NodeCG instance package.json');
    await fsp.writeFile(instancePkg, JSON.stringify({
      name: 'nodecg-instance',
      version: '1.0.0',
      private: true,
      dependencies: { nodecg: '^2.2.1' }
    }, null, 2));
  }

  // Ensure dependencies in root (unless user opts out)
  const nodecgModule = path.join(rootDir, 'node_modules', 'nodecg');
  if (process.env.SKIP_INSTALL) {
    log('SKIP_INSTALL is set, skipping automatic npm install');
  } else if (!fs.existsSync(nodecgModule)) {
    log('Installing dependencies in project root (npm install)...');

    const runNpmInstall = async () => {
      const isWin = process.platform === 'win32';
      const baseCmd = isWin ? 'npm.cmd' : 'npm';
      const args = ['install'];
      const spawnOpts = { cwd: rootDir, stdio: 'inherit', windowsHide: false };
      try {
        await new Promise((res, rej) => {
          const p = spawn(baseCmd, args, spawnOpts);
          p.on('error', err => rej(err));
          p.on('exit', code => code === 0 ? res() : rej(new Error(`npm install failed with code ${code}`)));
        });
        return;
      } catch (err) {
        log(`Primary spawn failed: ${err.code || err.name || ''} ${err.message}`);
        if (process.platform === 'win32') {
          // Fallback 1: use shell so that cmd.exe resolves npm
          try {
            log('Retrying npm install using shell fallback...');
            await new Promise((res, rej) => {
              const p = spawn(baseCmd, args, { ...spawnOpts, shell: true });
              p.on('error', e => rej(e));
              p.on('exit', code => code === 0 ? res() : rej(new Error(`npm install (shell) failed with code ${code}`)));
            });
            return;
          } catch (shellErr) {
            log(`Shell fallback failed: ${shellErr.code || ''} ${shellErr.message}`);
            // Fallback 2: directly invoke npm-cli.js via node executable
            try {
              const npmCli = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
              if (fs.existsSync(npmCli)) {
                log('Retrying npm install by invoking npm-cli.js directly...');
                await new Promise((res, rej) => {
                  const p = spawn(process.execPath, [npmCli, ...args], spawnOpts);
                  p.on('error', e => rej(e));
                  p.on('exit', code => code === 0 ? res() : rej(new Error(`npm install (npm-cli.js) failed with code ${code}`)));
                });
                return;
              } else {
                log('npm-cli.js not found for direct invocation fallback');
              }
            } catch (cliErr) {
              log(`npm-cli.js fallback failed: ${cliErr.message}`);
            }
          }
        }
        throw err; // rethrow if all fallbacks fail
      }
    };

    try {
      await runNpmInstall();
    } catch (installErr) {
      log('Automatic dependency installation failed.');
      log('To proceed, manually run:');
      log(`  cd ${rootDir}`);
      log('  npm install');
      log('Then re-run:');
      log('  npm run nodecg');
      throw installErr;
    }
  }

  // Link node_modules into instance
  const instanceNodeModules = path.join(instanceDir, 'node_modules');
  if (!fs.existsSync(instanceNodeModules)) {
    try {
      const type = process.platform === 'win32' ? 'junction' : 'dir';
      await fsp.symlink(path.join(rootDir, 'node_modules'), instanceNodeModules, type);
      log('Linked node_modules into instance');
    } catch {
      log('Symlink node_modules failed, copying (may be slower)');
      await fsp.cp(path.join(rootDir, 'node_modules'), instanceNodeModules, { recursive: true });
    }
  }

  // Link bundle
  if (!fs.existsSync(bundleLink)) {
    try {
      const type = process.platform === 'win32' ? 'junction' : 'dir';
      await fsp.symlink(rootDir, bundleLink, type);
      log('Bundle symlink created');
    } catch {
      log('Bundle symlink failed, copying bundle');
      await fsp.mkdir(bundleLink, { recursive: true });
      // Minimal copy excluding instance and node_modules
      const exclude = new Set(['node_modules', 'nodecg-instance']);
      for (const entry of await fsp.readdir(rootDir)) {
        if (exclude.has(entry)) continue;
        await fsp.cp(path.join(rootDir, entry), path.join(bundleLink, entry), { recursive: true });
      }
    }
  }

  // Ensure cfg with desired port (NodeCG expects cfg/nodecg.json)
  try {
    const cfgDir = path.join(instanceDir, 'cfg');
    await fsp.mkdir(cfgDir, { recursive: true });
    const nodecgCfgFile = path.join(cfgDir, 'nodecg.json');
    if (!fs.existsSync(nodecgCfgFile)) {
      await fsp.writeFile(nodecgCfgFile, JSON.stringify({ port: Number(port) }, null, 2));
      log('Created cfg/nodecg.json with port');
    } else if (process.env.FORCE_PORT_UPDATE) {
      const current = JSON.parse(await fsp.readFile(nodecgCfgFile, 'utf8'));
      if (current.port !== Number(port)) {
        current.port = Number(port);
        await fsp.writeFile(nodecgCfgFile, JSON.stringify(current, null, 2));
        log('Updated cfg/nodecg.json port');
      }
    }
  } catch (cfgErr) {
    log(`Warning: could not ensure cfg/nodecg.json: ${cfgErr.message}`);
  }

  log(`Launching (configured) on port ${port}`);
  log(`Graphics: http://localhost:${port}/bundles/${bundleName}/graphics/`);
  log(`Dashboard: http://localhost:${port}/#/bundle/${bundleName}`);

  const nodecgBin = path.join(rootDir, 'node_modules', '.bin', process.platform === 'win32' ? 'nodecg.cmd' : 'nodecg');

  // We'll prefer spawning the CLI JS directly (avoids .cmd shim issues & lets us control args)
  let cliEntry = null;
  try {
    const pkgPath = path.join(rootDir, 'node_modules', 'nodecg', 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(await fsp.readFile(pkgPath, 'utf8'));
      if (pkg && pkg.bin) {
        if (typeof pkg.bin === 'string') cliEntry = path.join(rootDir, 'node_modules', 'nodecg', pkg.bin);
        else if (pkg.bin.nodecg) cliEntry = path.join(rootDir, 'node_modules', 'nodecg', pkg.bin.nodecg);
      }
    }
  } catch (e) {
    log(`Could not parse nodecg package.json: ${e.message}`);
  }
  if (cliEntry && !fs.existsSync(cliEntry)) {
    log(`Resolved CLI entry does not exist: ${cliEntry}`);
    cliEntry = null;
  }

  const launchArgs = ['start'];

  const debugSpawn = process.env.NODECG_DEBUG_SPAWN;
  const showDebug = () => {
    if (!debugSpawn) return;
    log('Spawn debug info:');
    log(`  node version: ${process.version}`);
    log(`  platform: ${process.platform}`);
    log(`  cwd(instance): ${instanceDir}`);
    log(`  nodecgBin exists: ${fs.existsSync(nodecgBin)}`);
    if (fs.existsSync(nodecgBin)) {
      try { log(`  nodecgBin size: ${fs.statSync(nodecgBin).size}`); } catch {}
    }
    log(`  PATH: ${process.env.PATH}`);
  };

  const attemptSpawn = async () => {
    showDebug();
    // Strategy 1: spawn CLI JS via node (preferred)
    if (cliEntry) {
      try {
        log(`Attempting direct node execution: ${cliEntry}`);
        await new Promise((res, rej) => {
          const p = spawn(process.execPath, [cliEntry, ...launchArgs], { cwd: instanceDir, stdio: 'inherit', windowsHide: false });
          p.on('error', rej);
          p.on('exit', code => code === 0 ? res() : rej(new Error(`node (cli) exited with code ${code}`)));
        });
        return true;
      } catch (e1a) {
        log(`Node CLI spawn failed: ${e1a.code || ''} ${e1a.message}`);
      }
    } else {
      log('No CLI JS entry resolved; skipping direct node strategy');
    }

    // Strategy 2: direct binary (.cmd / shim)
    try {
      await new Promise((res, rej) => {
        const p = spawn(nodecgBin, launchArgs, { cwd: instanceDir, stdio: 'inherit', windowsHide: false });
        p.on('error', rej);
        p.on('exit', code => code === 0 ? res() : rej(new Error(`nodecg exited with code ${code}`)));
      });
      return true;
    } catch (e1) {
      log(`Direct shim spawn failed: ${e1.code || ''} ${e1.message}`);
    }

    // Strategy 3: spawn via shell (Windows quirks)
    try {
      log('Retrying with shell spawn...');
      await new Promise((res, rej) => {
        const p = spawn(nodecgBin, launchArgs, { cwd: instanceDir, stdio: 'inherit', shell: true });
        p.on('error', rej);
        p.on('exit', code => code === 0 ? res() : rej(new Error(`nodecg (shell) exited with code ${code}`)));
      });
      return true;
    } catch (e2) {
      log(`Shell spawn failed: ${e2.code || ''} ${e2.message}`);
    }

  // Strategy 4: use npx (resolves command differently)
    try {
      log('Retrying via npx nodecg ...');
      await new Promise((res, rej) => {
        const p = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['nodecg', ...launchArgs], { cwd: instanceDir, stdio: 'inherit', windowsHide: false });
        p.on('error', rej);
        p.on('exit', code => code === 0 ? res() : rej(new Error(`npx nodecg exited with code ${code}`)));
      });
      return true;
    } catch (e3) {
      log(`npx spawn failed: ${e3.code || ''} ${e3.message}`);
    }

    // Strategy 5: (legacy) try guessing bin/nodecg or bin/nodecg.js
    for (const guess of ['bin/nodecg', 'bin/nodecg.js']) {
      const guessPath = path.join(rootDir, 'node_modules', 'nodecg', guess);
      if (fs.existsSync(guessPath)) {
        try {
          log(`Trying guessed CLI path: ${guessPath}`);
            await new Promise((res, rej) => {
              const p = spawn(process.execPath, [guessPath, ...launchArgs], { cwd: instanceDir, stdio: 'inherit', windowsHide: false });
              p.on('error', rej);
              p.on('exit', code => code === 0 ? res() : rej(new Error(`node ${guess} exited with code ${code}`)));
            });
            return true;
        } catch (gErr) {
          log(`Guess path failed (${guess}): ${gErr.code || ''} ${gErr.message}`);
        }
      }
    }
    return false;
  };

  const ok = await attemptSpawn();
  if (!ok) {
    log('All spawn strategies failed. Please try manually:');
    log(`  cd ${instanceDir}`);
    log(`  npx nodecg start --port ${port}`);
    log('If that also fails, enable debug and re-run:');
    log('  set NODECG_DEBUG_SPAWN=1  (Windows CMD)');
    log('  $env:NODECG_DEBUG_SPAWN=1 (PowerShell)');
  }
})();
