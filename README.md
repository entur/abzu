# Abzu

Stop place register frontend.
Uses stop place register backend tiamat's graphQL API

The app is built on top of [Create React App](https://create-react-app.dev/docs/getting-started).

### Configuration

See `src/config/enviroments` for environment specific configuration.

## Development

To run Abzu for development, simply do:

```
npm install
npm start
```

Note: This will launch the application with hot reload enabled.

Default port in development is _9000_. This can be overrided by setting the environment
variable `port` (notice lower case).

To override timatBaseURL (GraphQL endpoint), set `TIAMAT_BASE_URL` as environment variables, e.g.

```
TIAMAT_BASE_URL=https://api.dev.entur.org/stop_places/1.0/graphql port=9000 NODE_ENV=development node server.js
```

### Testing

Uses [Jest](https://facebook.github.io/jest/) to test unit and reducer testing

```
npm test
```

### Authentication

Uses Auth0 to authenticate user and read JWT.

### Themes

Default theme is found in `./config/default` .

#### Add custom theme

* Create new directory: `./config/themes/{YOUR_THEME_NAME}`
* Add `logo.png` to `./config/themes/{YOUR_THEME_NAME}`
* Add `index.js` with custom fyles (cf. `defaultTheme.js`)
* Set `process.env.REACT_APP_THEME={YOUR_THEME_NAME}`
