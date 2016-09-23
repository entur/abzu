# Abzu

Stop place register

## Development

To run Abzu for development, simply do:

```
npm install
npm run dev
```

Note: This will launch the application on http://localhost:8988 with
NODE_ENV set to development and hot reload enabled.

To override the port include

```
port=YOUR_PORT
```

To override timatBaseURL the easiest way is by adding `TIAMAT_BASE_URL` as environment variables, e.g.

```
TIAMAT_BASE_URL=http://localhost:9011 port=9000 npm run dev
```

## Configuration

We use node-convict for config. Set environment variables `TIAMAT_BASE_URL` and `ENDPOINTBASE` in order to override default configuration of these endpoints.
The configuration including schemas for these are found in `config/convict-promise.js`

You can serve a config file and provide a `CONFIG_URL` env to let node-convict do this for you.

## Webpack

Webpack uses `webpack.config.js` for development and `webpack.prod.config.js` for production code. Correct config is chosen based on NODE_ENV `production` and `development`(i.e. NOT `production`).

Webpack produces `public/bundle` which is the entire application rendered by the server. In development this file is emitted from webpack through [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) over a connect server. No file is written to disk. These facilities hot-reload.

## Production

In order to build the webpack bundle and run the application, use

```
npm run build
npm run prod
```

## Testing

Uses Mocha together with Nock to test reducers and actions, e.g.

```
npm run test-reducers
```

This is a start and will be improved.
