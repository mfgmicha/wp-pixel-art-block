async function globalTeardown() {
  if (global.__PLAYWRIGHT_SERVER__) {
    await global.__PLAYWRIGHT_SERVER__.close();
  }
}

module.exports = globalTeardown;
