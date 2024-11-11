# Abzu [![Build and deploy](https://github.com/entur/abzu/actions/workflows/build.yml/badge.svg)](https://github.com/entur/abzu/actions/workflows/build.yml)

Stop place register frontend.
Uses stop place register backend tiamat's graphQL API

The app is built on top of [Create React App](https://create-react-app.dev/docs/getting-started).

### Configuration

Configuration is bootstrapped from /bootstrap.json, when the app loads. You should 
add your environment-specific config to the deployment, along with the built static
files (i.e. in the build/ folder).

For local development, add a bootstrap.json file to the public/ folder.

See src/config/ConfigContext.ts for the shape of the configuration.

## Development

To run Abzu for development, simply do:

```
npm install
npm start
```

Note: This will launch the application with hot reload enabled.

Default port in development is _9000_. This can be overridden by setting the environment
variable `PORT`.

To override timatBaseURL (GraphQL endpoint), set `VITE_REACT_APP_TIAMAT_BASE_URL` as environment variables.

### Testing

Uses [Jest](https://facebook.github.io/jest/) to test unit and reducer testing

```
npm test
```

## Authentication

Uses OIDC for authentication. This solution is agnostic to which authentication provider you use.

Example configuration (works with Auth0):

```json
{
    "oidcConfig": {
      "authority": "https://<authentication domain>",
      "client_id": "<client id>",
      "extraQueryParams": {
        "audience": "<example audience>"
      }
    }
}
  ```

For full configuration reference, see [oidc-client-ts documentation](https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html).

### Themes

Default theme is found in `./config/default` .

#### Add custom theme

* Create new directory: `./config/themes/{YOUR_THEME_NAME}`
* Add `logo.png` to `./config/themes/{YOUR_THEME_NAME}`
* Add `index.js` with custom fyles (cf. `defaultTheme.js`)
* Set `process.env.REACT_APP_THEME={YOUR_THEME_NAME}`
