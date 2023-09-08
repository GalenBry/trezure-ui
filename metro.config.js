const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);
const { resolver: { sourceExts } } = defaultConfig;

const config = {
    transformer: {
        babelTransformerPath: require.resolve("react-native-typed-sass-transformer")
    },
    resolver: {
        sourceExts: [...sourceExts, "scss", "sass"]
    }
}
module.exports = mergeConfig(defaultConfig, config);