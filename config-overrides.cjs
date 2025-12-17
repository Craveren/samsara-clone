// config-overrides.cjs for Create React App
// CommonJS format (required for react-app-rewired)

const path = require(`path`);
const alias = require(`./aliases`);
const { aliasWebpack } = require('react-app-alias');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const SRC = `./src`;
const aliases = alias(SRC);

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)])
);

const options = {
  alias: resolvedAliases,
};

module.exports = function override(config, env) {
  // Ignore source map warnings
  config.ignoreWarnings = [{ message: /Failed to parse source map/ }];

  // Apply aliases
  const configWithAliases = aliasWebpack(options)(config);

  // Add bundle analyzer in development if ANALYZE=true
  if (process.env.ANALYZE === 'true') {
    configWithAliases.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true,
        reportFilename: 'bundle-report.html',
      })
    );
  }

  return configWithAliases;
};

