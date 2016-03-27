'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET index route.
 */
router.get('/', (req, res, next) => res.render('index'));

module.exports = router;
