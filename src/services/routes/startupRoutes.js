const express = require('express');
const { handleStartupMessage } = require('../../controllers/startupController');

const router = express.Router();

router.post('/process-startup', handleStartupMessage);

module.exports = router;
