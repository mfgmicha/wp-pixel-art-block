#!/bin/bash

set -x

echo "=== Starting playground embed generation ==="
echo "Cleaning output directory..."
rm -rf output
mkdir -p output

echo "Copying plugin zip to output directory..."
cp pixel-art-creator.zip output/plugin.zip

echo "Creating HTML with embedded WordPress Playground..."
cat > output/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Pixel Art Block Demo</title>
	<style>
		* {
			box-sizing: border-box;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
			margin: 0;
			padding: 0;
			background: #1a1a2e;
			min-height: 100vh;
		}
		header {
			background: #16213e;
			padding: 20px;
			text-align: center;
		}
		h1 {
			color: #fff;
			margin: 0;
			font-size: 1.5rem;
		}
		p {
			color: #a0a0a0;
			margin: 10px 0 0;
			font-size: 0.9rem;
		}
		iframe {
			width: 100%;
			height: calc(100vh - 100px);
			border: none;
		}
	</style>
</head>
<body>
	<header>
		<h1>Pixel Art Block Demo</h1>
		<p>Interactive WordPress Playground</p>
	</header>
	<iframe id="playground"></iframe>

	<script type="module">
		const iframe = document.getElementById('playground');
		
		const blueprint = {
			"$schema": "https://playground.wordpress.net/blueprint-schema.json",
			"preferredVersions": {
				"wp": "latest",
				"php": "8.4"
			},
			"steps": [
				{
					"step": "installPlugin",
					"pluginZip": {
						"resource": "wordpress.org\/plugin",
						"slug": "hello-dolly"
					}
				},
				{
					"step": "wp-cli",
					"command": "wp post create --post_type=page --post_title='Pixel Art Demo' --post_name='pixel-art' --post_content='<!-- wp:mfgmicha/pixel-art-creator /-->' --post_status=publish"
				},
				{
					"step": "wp-cli",
					"command": "wp option set show_on_front page"
				},
				{
					"step": "wp-cli",
					"command": "wp option set page_on_front $(wp post list --post_type=page --post_name=pixel-art --format=ids)"
				}
			]
		};

		const playgroundUrl = new URL('https://playground.wordpress.net/');
		playgroundUrl.searchParams.set('blueprint', JSON.stringify(blueprint));
		
		iframe.src = playgroundUrl.toString();
	</script>
</body>
</html>
HTMLEOF

echo "Checking for index.html..."
ls -la output/
if [ ! -f output/index.html ]; then
    echo "ERROR: index.html not found!"
    exit 1
fi
echo "=== Done! ==="
