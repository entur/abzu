module.exports = function(config){
  config.set({
    basePath : './',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'keycloak-mock.js',
      'app/js/app.js',
      'app/services/**/*.js',
      'app/modules/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS', 'Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            ],

    junitReporter : {
      outputDir: '.',
      useBrowserName: false,
      outputFile: 'test-results.xml',
      suite: 'unit'
    }

  });
};
