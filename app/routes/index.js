'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET index route.
 */
router.get('/', (req, res, next) => res.sendFile('./public/index.html'));

module.exports = router;
