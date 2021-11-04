const express = require('express');
const middlewares = require('../middlewares');
const AuthRoutes = require('../modules/auth/routes/v1');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send(`OK - ${req.baseUrl}`);
});

router.use('/auth', AuthRoutes);

router.get('/testing', middlewares.isAuthenticated, (req, res) => {
  
  res.send(req.user);
});

module.exports = router;