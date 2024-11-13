let mix = require('laravel-mix');

mix.webpackConfig({
    module: {
        rules: [
            {
                test: require.resolve('isotope-layout'),
                loader: 'imports-loader',
                options: {
                    type: 'commonjs',
                    imports: 'single isotope-layout/js/isotope Isotope',
                    wrapper: 'window',
                },
            },
        ],
    },
});

mix
    .js('assets/src/js/app.js', 'assets/dist/')
    .sass('assets/src/scss/app.scss', 'assets/dist/')
    .options({
        processCssUrls: false
    })
    .browserSync({
        proxy: "ghost.local:8888",
        files: [
            "./assets/dist/*",
            "./assets/src/js/**/*.js",
            "./assets/src/img/**/*.+(png|jpg|svg)",
            "./**/*.+(html|php)",
            "./views/**/*.+(html|twig)"
        ]
    });