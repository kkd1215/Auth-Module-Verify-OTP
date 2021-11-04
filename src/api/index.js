const express = require('express');
const middlewares = require('../middlewares');
const v1Routes = require('./v1');

const apiRoutes = express();

apiRoutes.get('/', (req, res) => {
  res.status(200).send(`OK - ${req.url}`);
});

apiRoutes.use('/', middlewares.authentication)
apiRoutes.use('/v1', v1Routes);

module.exports = apiRoutes;