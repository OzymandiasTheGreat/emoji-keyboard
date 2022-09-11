const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async (env, argv) => {
	const config = await createExpoWebpackConfigAsync(env, argv);

	config.resolve.alias = {
		...config.resolve.alias,
		// Use Preact aliases
		react: "preact/compat",
		"react-dom/test-utils": "preact/test-utils",
		"react-dom/unstable-native-dependencies$":
			"preact-responder-event-plugin",
		"react-dom": "preact/compat", // Must be below test-utils
		"react/jsx-runtime": "preact/jsx-runtime",
	};
	return config;
};
