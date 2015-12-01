# Abzu

Abzu is the user interface component for Tiamat (holdeplassregister), based on Angular seed: https://github.com/angular/angular-seed

To download dependencies, execute
```npm install```

To run the application, execute:
```npm start```

Browse:
```http://localhost:8000/app```

## Testing
See the script section in package.json for configuration of the npm commands below.
The test runner is https://www.npmjs.com/package/karma. Karma is configured in karma.conf.json.

Run unit tests:
```npm run test```

Single run unit tests:
```npm run test-single-run```

Single run unit tests with PhantomJS.
```npm run test-single-ci-run```

Prepare protractor
```npm run preprotractor```

Run protractor
```npm run protractor``

See https://angular.github.io/protractor