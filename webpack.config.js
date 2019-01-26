module.exports = {
    entry: {
        'react-localizer': './src/index.js',
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
        },
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: __dirname,
        publicPath: '/dist',
        libraryTarget: 'umd',
        library: 'reactLocalizer',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};

