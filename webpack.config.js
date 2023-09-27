const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const outputPath = path.resolve(__dirname, "dist");
const isModuleCSS = (module) => {
  return module.type === "css/mini-extract";
};

module.exports = {
  mode: "development",
  entry: {
    app: require.resolve("./src/index")
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: outputPath,
    clean: true
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.yaml$/,
        use: [{ loader: "json-loader" }, { loader: "yaml-loader" }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader" }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: require.resolve("swagger-ui/dist/oauth2-redirect.html"),
          to: "./"
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: `./index.html`
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 10000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        default: false,
        vedors: false,
        swaggerUIES: {
          chunks: "all",
          name: "swagger-ui-es",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](swagger-ui\/dist\/swagger-ui-es-bundle)/,
          priority: 40,
          enforce: true
        },
        swagger: {
          chunks: "all",
          name: "swagger",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](swagger-ui)[\\/]/,
          priority: 30,
          enforce: true
        },
        lib: {
          test(module) {
            return (
              module.size() > 80000 &&
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name(module) {
            const hash = crypto.createHash("sha1");

            if (isModuleCSS(module)) {
              module.updateHash(hash);

              return hash.digest("hex").substring(0, 8);
            } else {
              if (!module.libIdent) {
                throw new Error(
                  `Encountered unknown module type: ${module.type}. Please open an issue.`
                );
              }
            }
            hash.update(module.libIdent({ context: __dirname }));

            return hash.digest("hex").substring(0, 8);
          },
          priority: 50,
          minChunks: 1,
          reuseExistingChunk: true
        },
        commons: {
          name: "commons",
          minChunks: 1, // entry points length
          priority: 20
        }
      }
    }
  }
};
