/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fallback = require('express-history-api-fallback');

const contentRoot = path.resolve(process.env.CONTENT_BASE || './build');

const configureApp = async (app) => {
  app.use(bodyParser.json());

  app.get('/_health', function(req, res) {
    res.sendStatus(200);
  });

  app.use('/', express.static(contentRoot))

  app.use('/', fallback('index.html', { root: contentRoot }))
  .use((err, req, res, next) => {
    console.log(`Request to ${req.url} failed: ${err.stack}`);
    next(err);
  });

  app.use('/', (err, req, res, next) => {
    res.status(500);
    res.send({
      code: 'INTERNAL_ERROR',
      message: 'Ooops. Something broke back here. Sorry!'
    });
  });

  return app;
};



module.exports = { configureApp };
