# Abzu

Stop place register

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
TIAMAT_BASE_URL=https://test.rutebanken.org/api/tiamat/1.0/graphql port=9000 npm run dev
```

To override OpenStreetMap URL, set `OSM_URL` as environment variables, e.g.

```
OSM_URL=https://test.rutebanken.org/api/map/1.0/{z}/{x}/{y}.png port=9000 npm run dev
```


### Testing

Uses Mocha to test unit testing and reducers

```
npm run test
```


## Webpack

Webpack uses `webpack.config.js` for development and `webpack.prod.config.js` for production code. Correct config is chosen based on NODE_ENV.

Webpack produces `public/bundle` which is the entire application rendered by the server. In development this file is emitted from webpack through [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) over a connect server. No file is written to disk. These facilities hot-reload.
