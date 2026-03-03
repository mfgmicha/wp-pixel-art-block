const { runCLI } = require("@wp-playground/cli");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

/**
 * Start WordPress Playground server for testing
 * @returns {Promise<{close: () => Promise<void>, url: string}>}
 */
async function startPlaygroundServer() {
  console.log("Starting WordPress Playground...");

  const server = await runCLI({
    command: "server",
    php: "8.4",
    wp: "latest",
    port: 8890,
    mount: [
      {
        hostPath: projectRoot,
        vfsPath: "/wordpress/wp-content/plugins/wp-pixel-art-block",
      },
    ],
    blueprint: {
      preferredVersions: { wp: "latest", php: "8.4" },
      steps: [
        {
          step: "activatePlugin",
          pluginPath: "wp-pixel-art-block/plugin.php",
        },
        {
          step: "wp-cli",
          command:
            "wp post create --post_type=page --post_title='Pixel Art' --post_name=pixel-art --post_content='<!-- wp:mfgmicha/pixel-art-creator /-->' --post_status=publish",
        },
      ],
    },
  });

  console.log(`Playground started at ${server.url}`);

  return {
    close: async () => {
      console.log("Stopping WordPress Playground...");
      await server.close();
    },
    url: server.url,
  };
}

module.exports = { startPlaygroundServer };
