const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'src')
const dirStyles = path.join(__dirname, 'styles')

const dirNode = 'node_modules'

module.exports = {
	entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
	resolve: {
		modules: [dirApp, dirStyles, dirNode],
	},
	plugins: [
		new webpack.DefinePlugin({ IS_DEVELOPMENT }),

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new CleanWebpackPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '',
						},
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',

				options: {
					name(file) {
						return '[hash].[ext]'
					},
				},
			},
			{
				test: /\.(jpe?g|png|gif|svg|webp)$/i,
				loader: ImageMinimizerPlugin.loader,
				enforce: 'pre',
				options: {
					generator: [
						{
							// You can apply generator using `?as=webp`, you can use any name and provide more options
							preset: 'webp',
							implementation: ImageMinimizerPlugin.imageminGenerate,
							options: {
								// Please specify only one plugin here, multiple plugins will not work
								plugins: ['imagemin-webp'],
							},
						},
						{
							// You can apply generator using `?as=webp`, you can use any name and provide more options
							preset: 'png',
							implementation: ImageMinimizerPlugin.imageminGenerate,
							options: {
								// Please specify only one plugin here, multiple plugins will not work
								plugins: ['imagemin-optipng', { optimizationLevel: 8 }],
							},
						},
						{
							// You can apply generator using `?as=webp`, you can use any name and provide more options
							preset: 'gif',
							implementation: ImageMinimizerPlugin.imageminGenerate,
							options: {
								// Please specify only one plugin here, multiple plugins will not work
								plugins: ['imagemin-gifsicle', { interlaced: true }],
							},
						},
						{
							// You can apply generator using `?as=webp`, you can use any name and provide more options
							preset: 'jpeg',
							implementation: ImageMinimizerPlugin.imageminGenerate,
							options: {
								// Please specify only one plugin here, multiple plugins will not work
								plugins: ['imagemin-jpegtran', { progressive: true }],
							},
						},
					],
				},
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/,
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
}
