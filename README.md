# Abzu

Stop place register frontend.
Uses stop place register backend tiamat's graphQL API

## Production

In order to build the webpack bundle and run the application, use

```
npm run build && npm run prod
```

### Configuration

We use node-convict for config: `config/convict.js`

* `TIAMAT_BASE_URL` : Where to find tiamat
* `ENDPOINTBASE` : Where th application resides, in development defaulting
  to `/` but in the test environment `/admin/nsr/`   

You can serve a config file and provide a `CONFIG_URL` env to let node-convict do this for you.

## Development

To run Abzu for development, simply do:

```
npm install
npm run dev
```

Note: This will launch the application with hot reload enabled.

Default port is _8988_. This can be overrided by setting the environment
variable `port` (notice lower case).

To override timatBaseURL (GraphQL endpoint), set `TIAMAT_BASE_URL` as environment variables, e.g.

```
TIAMAT_BASE_URL=https://api-test.entur.org/stop_places/1.0/graphql port=9000 NODE_ENV=development node server.js
```

```

### Testing

Uses [Jest](https://facebook.github.io/jest/) to test unit and reducer testing

```
npm test
```

### Authentication

Uses Keycloak to authenticate user and read JWT, set `auth-server-url`:

```
AUTH_SERVER_URL=https://www-test.entur.org/auth port=9000 NODE_ENV=development node server.js
```

### Themes

Default theme is found in `./config/default`.

#### Add custom theme

* Create new directory: `./config/themes/{YOUR_THEME_NAME}`
* Add `logo.png` to `./config/themes/{YOUR_THEME_NAME}`
* Add `index.js` with custom fyles (cf. `defaultTheme.js`)
* Set `process.env.THEME={YOUR_THEME_NAME}`

This is WIP.

## Webpack

Webpack uses `webpack.dev.config.js` for development and `webpack.prod.config.js` for production code. Correct config is chosen based on NODE_ENV.

Webpack produces `public/bundle` which is the entire application rendered by the server. In development this file is emitted from webpack through [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) over a connect server. No file is written to disk. These facilities hot-reload.

## Troubleshooting

### Issues with pngquant on linux
#### Error message:
```
error while loading shared libraries: libpng12.so.0
```

#### Cause
Ubuntu has, at the time of writing, libpng 16, not libpng 12.

#### Workaround:
```
wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && sudo dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb
```
