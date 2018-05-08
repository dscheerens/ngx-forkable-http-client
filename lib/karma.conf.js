module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-coverage'),
            require('karma-mocha-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        mochaReporter: {
            ignoreSkipped: true
        },
        reporters: [
          'mocha',
          'coverage'
        ],
        coverageReporter: {
            dir: '../coverage/',
            reporters: [
              { type: 'text-summary' },
              { type: 'in-memory' },
              { type: 'cobertura', subdir: '.' }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserNoActivityTimeout: 20000,
        browsers: [ 'ChromeHeadless' ],
        singleRun: false
    });
};
